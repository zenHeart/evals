<p align="center">
  <img src="assets/refrain-icon.svg" width="260" alt="Refrain logo">
</p>

<h1 align="center">Refrain</h1>

<h3 align="center">Learning Multi-Shot Consistency from Inconsistent References for A²O Video Generation</h3>

<p align="center"><b>Any Reference · Any Duration · One Timeline</b></p>

<p align="center">
<a href="https://refrain-page.github.io/"><img src="https://img.shields.io/badge/Project-Page-ff6f61.svg" alt="Project Page"></a>
<a href="https://arxiv.org/abs/2611.27806"><img src="https://img.shields.io/badge/arXiv-2611.27806-b31b1b.svg" alt="arXiv"></a>
</p>

<p align="center">
Hongru Yan<sup>1,2,*</sup>, Yue Wu<sup>2,&Dagger;</sup>, Jian-Wei Zhang<sup>2</sup>, Liangbin Xie<sup>2,3</sup>, Mingzhe Zheng<sup>2,4</sup>, Shenghua Gao<sup>1,&dagger;</sup>
<br>
<sup>1</sup>The University of Hong Kong &nbsp; <sup>2</sup>Tencent &nbsp; <sup>3</sup>University of Macau &nbsp; <sup>4</sup>The Hong Kong University of Science and Technology
<br>
<sup>*</sup>Work done during internship at Tencent Hunyuan &nbsp; <sup>&dagger;</sup>Corresponding author &nbsp; <sup>&Dagger;</sup>Project leader
</p>

**Refrain** generates a coherent multi-shot video in **a single diffusion pass** from any mix of
text, image and video references. References are placed on one shared timeline, each shot keeps
its requested duration, and references with clashing styles are rendered in one consistent look.
The model learns this by **reconstructing an unedited video from references that were restyled
independently**, so it has to remove the style clashes itself. We also release the **Refrain
Benchmark** and **Shot-Debiased Consistency (SDC)**, a cross-shot style metric calibrated on 2.14M
real videos. More results are on the [project page](https://refrain-page.github.io/).

![Refrain teaser: T2V, V2V, TI2V and TIV2V requests on one shared timeline](assets/teaser.jpg)

## Highlights

- **Self-supervised reconstruction learning.** Reference shots cut from the same source video are
  edited independently (lighting, background, style, subject appearance), and the model is trained
  to recover the unedited source under a shared style prompt. It learns to suppress style conflicts
  while keeping reference content and motion. **DurMix-300K** provides these pairs with reference
  durations that differ from the target shot.
- **Unified sparse conditioning (A²O).** One backbone handles T2V, V2V, TI2V and TIV2V. Image and
  video references are written onto a shared temporal canvas at their target positions, with no
  extra conditioning modules. A reference can be shorter or longer than the shot it controls.
- **Shot-Debiased Consistency (SDC).** CLIP/DINO similarity mistakes intended cuts (new subject,
  new scene) for inconsistency and barely reacts to real style clashes. SDC compares cross-shot
  style change with what real videos show at the same amount of content change. It detects
  **78.0%** of single-shot style edits at 5% FPR and reaches **AUC 0.97** against human judgments on real footage.

## Abstract

A comic-book character, a photorealistic cityscape, an oil-painted coffee cup: such stylistically
diverse references provide visual guidance across shots and frames, yet generating a coherent
multi-shot video that unifies their visual styles while preserving subject identities and scene
content remains challenging. Existing methods maintain cross-shot continuity through additional
attention control or memory processing. However, they struggle to resolve disparate per-shot styles
or handle reference–target duration mismatches within a single framework.

To tackle this, we introduce **Refrain**, a unified model that learns cross-shot consistency through
a self-supervised reconstruction task: reference clips from the same original video are
deliberately perturbed with distinct visual edits, challenging the model to recover the unedited
source footage under a shared style prompt. In this way, Refrain learns to suppress conflicting
stylistic artifacts while faithfully retaining reference content and motion dynamics. Operating on
the A²O principle (**Any Reference, Any Duration, One Timeline**), Refrain maps image and video
references onto a shared temporal canvas without auxiliary conditioning modules. For evaluation,
experiments show that standard CLIP or DINO metrics frequently overlook stylistic clashes or
misinterpret intended narrative cuts as inconsistency. We therefore propose **Shot-Debiased
Consistency (SDC)**, which uses an extensive real-video bank to establish a baseline for style
variation associated with content changes. By discounting this baseline, SDC evaluates cross-shot
style shifts against real-world distributions. We further construct **DurMix-300K**, a dataset
pairing stylistically altered clips of varying lengths with their original video sequences, to
train the model. Extensive experiments demonstrate that Refrain achieves state-of-the-art
performance in cross-shot consistency, while excelling at shot timing, reference adherence, and
text alignment.

## Table of Contents

- [How Refrain Works](#how-refrain-works)
- [Shot-Debiased Consistency (SDC)](#shot-debiased-consistency-sdc)
- [Visual Results](#visual-results)
- [Quantitative Results](#quantitative-results)
- [Release Status](#release-status)
- [Installation](#installation)
- [Checkpoint Preparation](#checkpoint-preparation)
- [Quickstart](#quickstart)
- [Key Parameters](#key-parameters)
- [Repository Layout](#repository-layout)
- [Acknowledgements](#acknowledgements)
- [Citation](#citation)

## How Refrain Works

![Self-supervised reconstruction with DurMix (A) and joint multi-shot generation on one timeline (B)](assets/method.png)

**(A) DurMix-300K: references that disagree on purpose.** A coherent multi-shot source video is
cut into shots (TransNetV2). The first frame of selected shots is edited with one of 61
instructions (FLUX.1 Kontext: lighting, background, style transfer, subject appearance, …). The
clip is optionally cropped or extended to a new length (SkyReels-V3), and the edit is propagated
through the clip by a depth-conditioned Wan model. Qwen3-VL and TransNetV2 filter out degraded
clips. Each shot is edited *independently*, so the references clash with each other, while the
**unedited source video remains the reconstruction target**.

**(B) Refrain: one canvas, one trajectory.** All conditions are encoded by the 3D VAE and written
onto a reference canvas aligned with the target timeline.

| Component | Role |
|---|---|
| Reference canvas + occupancy mask | Reference latents sit at their exact target positions; empty slots are generated. An image anchor occupies one latent frame. |
| Sparse placement | A reference shorter than its shot fills only part of the shot; a longer one is mapped onto the shot's latent frames by frame selection that keeps its first and last frame. Latents are never interpolated. |
| Shot-aware RoPE | Each token carries its shot coordinate plus a per-shot offset, so the DiT knows where cuts are and which tokens belong together. |
| Shared style prompt + per-shot text | A global style description applies to every shot; each shot can add its own description or only a reference instruction. |
| HunyuanVideo-1.5 DiT (8.49B) | The backbone is unchanged; conditioning goes only through the canvas, mask and positions. |

Training has three stages, each resuming from the previous one:

| Stage | Steps | Data | Purpose |
|---|---:|---|---|
| `text_to_video` | 0 → 19k | multi-shot T2V | shot timeline and per-shot text |
| `reference_training` | 19k → 36k | references with equal target length | reconstruction from edited references |
| `variable_duration_training` | 36k → 45k | DurMix variable-length references | reference duration ≠ shot duration |

## Shot-Debiased Consistency (SDC)

![SDC: shot energies, content–style calibration and kappa stability](assets/sdc_figure.png)

A cut to a new character or location naturally changes CLIP/DINO features, so those metrics read
intended narrative changes as inconsistency, and they barely react to a real style clash. SDC asks
instead: *given how much the content changed between two shots, is the style change unusually
large compared with real videos?*

1. **Shots and frames.** TransNetV2 detects cuts; up to four frames are sampled per shot, with three-frame guards at each boundary.
2. **Content and style features.** DINOv2 for content; the CSD style head and VGG AdaIN statistics for style.
3. **Shot energies.** Cross-shot distances are contrasted with within-shot distances, giving a content energy and a style energy for every shot pair (A).
4. **Real-video calibration.** Style energy is linearly corrected for its dependence on content energy (slope κ ≈ 0.399, stable from 1K to 2.14M videos) and converted into a conditional survival rank within the real-video bank (B, C).
5. **Pooling.** Ranks from the two style heads are fused 2:1 and averaged over shot pairs:

```math
\mathrm{SDC}(V)=\binom{K}{2}^{-1}\sum_{1\le i \lt j\le K}\left(R^{\mathrm{CSD}}_{ij}\right)^{2/3}\left(R^{\mathrm{VGG}}_{ij}\right)^{1/3}
```

![SDC catches style edits that CLIP/ViCLIP miss and is not fooled by content cuts](assets/sdc_compare.jpg)

**Top:** a style edit applied to one shot drops SDC by 90–99%, while CLIP and ViCLIP barely move.
**Bottom:** real cuts between very different shots keep a high SDC even though DINO similarity is
near zero. The fitted real-video bank ships with this repository
([`evaluation/assets/sdc_bank/`](evaluation/assets/sdc_bank), 4.6 MB of quantile tables, no videos or
embeddings), so anyone can score their own videos without access to the 2.14M-video corpus.

## Visual Results

### Comparison with baselines

The three requests from the paper's qualitative comparison, played side by side: Refrain,
StoryMem and Phantom
receive the same per-shot references and prompts. References are restyled independently on purpose
(edit type under each thumbnail); Refrain follows their content and renders all shots in one style.

**V2V · Communal meal in the sun** <sub>(3 shots · 8.0 s · text + video references)</sub>

<img src="assets/comparison/113/compare.gif" width="100%" alt="Refrain, StoryMem and Phantom on the same request">

<table><tr>
<td width="55%" valign="top"><img src="assets/comparison/113/conditions.jpg" width="100%" alt="Per-shot conditions and prompts"></td>
<td width="45%" valign="top"><b>Shared style prompt</b><br><sub>Documentary, Realistic. The style is observational, capturing candid moments of social interaction. Bright, direct natural sunlight from a high angle, creating strong highlights and defined shadows. The lighting is high-key, contributing to the cheerful and open atmosphere. Joyful, social, and convivial. The video captures the warmth and intimacy of a community gathering, filled with laughter, conversation, and shared meals.</sub></td>
</tr></table>

**TI2V · Reading a comic under blue light** <sub>(2 shots · 5.0 s · text + image anchor)</sub>

<img src="assets/comparison/412/compare.gif" width="100%" alt="Refrain, StoryMem and Phantom on the same request">

<table><tr>
<td width="55%" valign="top"><img src="assets/comparison/412/conditions.jpg" width="100%" alt="Per-shot conditions and prompts"></td>
<td width="45%" valign="top"><b>Shared style prompt</b><br><sub>Realistic, contemporary drama. Cool, soft key light from the front-left, creating subtle shadows on the right side of the subject&#x27;s face. The background is dimly lit with some bokeh highlights, suggesting a low-key lighting setup. Contemplative and serious. The cool lighting and the character&#x27;s focused, somber expression create a mood of quiet introspection and concern.</sub></td>
</tr></table>

**TIV2V · Encounter in a Chinese courtyard** <sub>(5 shots · 10.3 s · text + image anchor + video references)</sub>

<img src="assets/comparison/255/compare.gif" width="100%" alt="Refrain, StoryMem and Phantom on the same request">

<table><tr>
<td width="55%" valign="top"><img src="assets/comparison/255/conditions.jpg" width="100%" alt="Per-shot conditions and prompts"></td>
<td width="45%" valign="top"><b>Shared style prompt</b><br><sub>Realistic, historical drama aesthetic. Bright, diffuse natural daylight, suggesting an overcast sky or indirect sunlight. The lighting is even and soft, with minimal harsh shadows, creating a clear and gentle visual tone. Initially serene and tranquil, the atmosphere shifts to one of surprise and slight tension with the unexpected arrival of the second woman.</sub></td>
</tr></table>

### Gallery

All videos are generated by Refrain in a single pass on held-out Refrain Benchmark requests. Under each
video, every shot lists its condition (video reference with its edit type and length, image anchor, or
text only) and its prompt; the shared style prompt that applies to all shots is folded below.

<table>
<tr>
<td width="50%" valign="top">
<img src="assets/gallery/case19-ti2v/ours.gif" width="100%" alt="Party treats">
<p><b>TI2V</b> · Party treats<br><sub>3 shots · 5.0 s · text + image anchor</sub></p>
<img src="assets/gallery/case19-ti2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic, contemporary teen drama style. Dim, warm ambient lighting with colored party lights (pink, purple) creating a festive but intimate feel. Soft key light on the characters&#x27; faces. A lively and social party atmosphere, with a hint of playful tension or anticipation among the characters.</sub></details>
</td>
<td width="50%" valign="top">
<img src="assets/gallery/case20-ti2v/ours.gif" width="100%" alt="Night street, vintage car">
<p><b>TI2V</b> · Night street, vintage car<br><sub>4 shots · 7.2 s · text + image anchor</sub></p>
<img src="assets/gallery/case20-ti2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic, with a strong nostalgic and film noir aesthetic. Low-key artificial lighting from street lamps, neon signs, and string lights, creating a high-contrast chiaroscuro effect with deep shadows and warm, specular highlights on the wet ground. Mysterious, tense, and nostalgic, evoking a classic film noir or historical drama feel.</sub></details>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<img src="assets/gallery/case7-v2v/ours.gif" width="100%" alt="Film-noir close-up">
<p><b>V2V</b> · Film-noir close-up<br><sub>3 shots · 6.3 s · text + video references</sub></p>
<img src="assets/gallery/case7-v2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic, Psychological Thriller, Film Noir. High-contrast key lighting, likely from a single source, creating dramatic shadows on the subjects&#x27; faces and enhancing the tense mood. Tense, unsettling, and psychologically charged, with a strong sense of suspense and unease.</sub></details>
</td>
<td width="50%" valign="top">
<img src="assets/gallery/case8-v2v/ours.gif" width="100%" alt="Woman on a green sofa">
<p><b>V2V</b> · Woman on a green sofa<br><sub>3 shots · 5.2 s · text + video references</sub></p>
<img src="assets/gallery/case8-v2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic, cinematic drama. Soft, warm indoor lighting. The first shot uses a key light from the side, creating gentle shadows. The final shot employs dramatic, low-key lighting with a strong side light that creates high contrast and deep shadows. Tense, somber, and dramatic. A feeling of quiet anticipation and unspoken conflict permeates the scenes.</sub></details>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<img src="assets/gallery/case9-v2v/ours.gif" width="100%" alt="Tense talk in a bar">
<p><b>V2V</b> · Tense talk in a bar<br><sub>5 shots · 9.0 s · text + video references</sub></p>
<img src="assets/gallery/case9-v2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic, cinematic drama. The shallow depth of field and warm color grading give it a filmic quality. Soft, warm key light from the side, illuminating the characters&#x27; faces against a dark background. The lighting creates a high-contrast, intimate mood with gentle shadows. Intimate and tense. The close-up shots and dim lighting create a feeling of a serious, private conversation with underlying emotional conflict.</sub></details>
</td>
<td width="50%" valign="top">
<img src="assets/gallery/case10-v2v/ours.gif" width="100%" alt="Stylish brick-wall bar">
<p><b>V2V</b> · Stylish brick-wall bar<br><sub>5 shots · 6.3 s · text + video references</sub></p>
<img src="assets/gallery/case10-v2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic with a cinematic, moody aesthetic. The lighting and color grading give it a slightly stylized, dramatic feel. Low-key lighting with multiple sources. Warm, soft light emanates from cylindrical table lamps and backlights within the wall shelves, creating a cozy yet dramatic effect. Cool blue and purple ambient light fills the space, adding depth and a modern, stylish feel. Tense and expectant. The dim lighting and the characters&#x27; focused expressions create a feeling of anticipation and seriousness, as if a significant event is about to unfold.</sub></details>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<img src="assets/gallery/case12-v2v/ours.gif" width="100%" alt="Chef at the racetrack">
<p><b>V2V</b> · Chef at the racetrack<br><sub>3 shots · 9.8 s · text + video references</sub></p>
<img src="assets/gallery/case12-v2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic with a nostalgic, filmic quality, reminiscent of a home movie or a classic family drama. Bright, diffuse natural daylight, creating soft shadows and an evenly lit scene. The light source is high and overhead, typical of an outdoor daytime setting. Joyful, nostalgic, and heartwarming. The scene conveys a sense of happy family moments and cherished memories being captured.</sub></details>
</td>
<td width="50%" valign="top">
<img src="assets/gallery/case13-v2v/ours.gif" width="100%" alt="Supernatural horror">
<p><b>V2V</b> · Supernatural horror<br><sub>4 shots · 8.5 s · text + video references</sub></p>
<img src="assets/gallery/case13-v2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic with strong horror and supernatural elements. The visual style is cinematic and dramatic, using high-contrast lighting and unsettling imagery. Dramatic, high-contrast chiaroscuro lighting. A strong, cool-toned key light from the side illuminates the subject, while the rest of the scene is plunged into shadow. The fire provides a secondary, warm, flickering light source. Intensely horrific and suspenseful. A palpable sense of terror, panic, and supernatural dread permeates the scene.</sub></details>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<img src="assets/gallery/case14-v2v/ours.gif" width="100%" alt="Couple sharing a meal">
<p><b>V2V</b> · Couple sharing a meal<br><sub>3 shots · 10.3 s · text + video references</sub></p>
<img src="assets/gallery/case14-v2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic, contemporary drama. Soft, diffuse frontal lighting that evenly illuminates the subjects, minimizing shadows and creating a bright, clean look. The light source appears to be large and off-camera. Intimate and casual, with a lighthearted and slightly playful mood between the two individuals.</sub></details>
</td>
<td width="50%" valign="top">
<img src="assets/gallery/case15-tiv2v/ours.gif" width="100%" alt="Thoughtful pause at a desk">
<p><b>TIV2V</b> · Thoughtful pause at a desk<br><sub>3 shots · 9.3 s · text + image anchor + video references</sub></p>
<img src="assets/gallery/case15-tiv2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic and cinematic, with a soft-focus aesthetic that creates a gentle, intimate mood. Soft, warm key light from a desk lamp on the left, creating a gentle glow on the subject. A warm, out-of-focus practical lamp provides ambient backlight, enhancing the cozy atmosphere. Contemplative, quiet, and slightly melancholic. The mood is introspective and personal, focusing on a moment of thoughtful pause.</sub></details>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<img src="assets/gallery/case17-tiv2v/ours.gif" width="100%" alt="Gossip in a classroom">
<p><b>TIV2V</b> · Gossip in a classroom<br><sub>4 shots · 9.7 s · text + image anchor + video references</sub></p>
<img src="assets/gallery/case17-tiv2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Realistic. The video is shot in a contemporary, naturalistic style typical of a modern television drama. Bright, even overhead lighting, likely from fluorescent fixtures. It creates a flat, high-key look with minimal shadows, illuminating the entire scene clearly. Tense and gossipy. The characters&#x27; expressions and body language convey a sense of shock, concern, and intense discussion, creating a dramatic and slightly conspiratorial mood.</sub></details>
</td>
<td width="50%" valign="top">
<img src="assets/gallery/case18-tiv2v/ours.gif" width="100%" alt="Sunlit outdoor market">
<p><b>TIV2V</b> · Sunlit outdoor market<br><sub>3 shots · 9.8 s · text + image anchor + video references</sub></p>
<img src="assets/gallery/case18-tiv2v/conditions.jpg" width="100%" alt="Per-shot conditions and prompts">
<details><summary>Shared style prompt</summary><sub>Documentary. Bright, direct natural sunlight from a high angle, creating strong, hard-edged shadows. The lighting is high-key, illuminating the scene clearly with minimal diffusion. Documentary and observational, capturing a slice of daily life in a bustling, sunlit outdoor market. The mood is neutral and candid, focusing on the interactions and environment.</sub></details>
</td>
</tr>
</table>

### Reference duration ≠ shot duration

![Short reference, longer target: 3.7 s reference for a 6.5 s shot](assets/duration_short.jpg)

**Short reference, longer target (3.7 s → 6.5 s).** Refrain keeps the pace of the camera gesture
and brings the referenced shot into the style of the surrounding shots.

![Long reference, shorter target: 3.9 s reference for a 2.8 s shot](assets/duration_long.jpg)

**Long reference, shorter target (3.9 s → 2.8 s).** Refrain condenses the action while keeping the
reaction, the hand gesture and the head turn at a natural pace.

## Quantitative Results

### Refrain Benchmark

300 requests (30 T2V, 30 TI2V, 120 V2V, 120 TIV2V) built from held-out videos with deliberately
conflicting references. **Bold** = best.

| Method | Params (B) | FLOPs (P) ↓ | MAE (s) ↓ | CLIP-T ↑ | TA ↑ | **SDC** ↑ |
|---|---:|---:|---:|---:|---:|---:|
| HunyuanVideo1.5 | 8.49 | **324.4** | 0.802 | 0.212 | −0.386 | 0.090 |
| Phantom | 14.29 | 648.7 | – | 0.203 | −0.675 | 0.130 |
| RefAlign | 14.29 | 807.7 | – | 0.204 | −0.530 | 0.125 |
| StoryMem | 29.80 | 493.2 | – | 0.197 | −0.679 | 0.175 |
| VACE | 17.34 | 608.9 | – | 0.217 | −0.336 | 0.108 |
| **Refrain** | 8.49 | **324.4** | **0.199** | **0.222** | **−0.221** | **0.315** |

| Method | Inter-shot Semantic ↑ | Inter-shot Subject ↑ | Inter-shot Scene ↑ | Ref. Semantic ↑ | Ref. Subject ↑ | Ref. Background ↑ |
|---|---:|---:|---:|---:|---:|---:|
| HunyuanVideo1.5 | 0.566 | 0.439 | 0.478 | – | – | – |
| Phantom | 0.491 | 0.345 | 0.385 | 0.556 | 0.450 | 0.376 |
| RefAlign | 0.493 | 0.341 | 0.361 | 0.614 | 0.469 | 0.448 |
| StoryMem | 0.708 | 0.489 | **0.531** | 0.478 | 0.412 | 0.388 |
| VACE | 0.492 | 0.362 | 0.361 | – | – | – |
| **Refrain** | **0.710** | **0.494** | 0.491 | **0.737** | **0.671** | **0.674** |

FLOPs are analytical denoising estimates for a 480×832, 241-frame, three-shot video with three
49-frame references under each method's own sampling schedule, excluding encoders and VAE
decoding. "–" means the metric does not apply to that method's protocol.

### Ablations

<table>
<tr><td valign="top">

**Reference-editing supervision**

| Train edits | Test edits | SDC ↑ |
|---|---|---:|
| Independent | Independent | **0.315** |
| Independent | Shared | 0.299 |
| Shared | Independent | 0.301 |
| Shared | Shared | 0.304 |

</td><td valign="top">

**Shot coordinates and placement**

| Coordinates | Placement | MAE (s) ↓ | SDC ↑ |
|---|---|---:|---:|
| Shot-aware | Sparse | **0.199** | **0.315** |
| Shot-aware | Resample | 0.233 | 0.310 |
| None | Sparse | 0.281 | 0.304 |
| None | Resample | 0.293 | 0.289 |

</td><td valign="top">

**Pure T2V (no references)**

| Training | SDC ↑ |
|---|---:|
| T2V pre-training | 0.253 |
| + independent edits | **0.303** |

</td></tr>
</table>

Training on independently edited references also makes text-only generation more consistent.

### Validating SDC

| Single-shot style edit (108,909 videos) | Score before → after | Detected @ 5% FPR ↑ |
|---|---|---:|
| CLIP | 0.836 → 0.711 | 48.6% |
| ViCLIP | 0.609 → 0.426 | 38.6% |
| DINO | 0.385 → 0.297 | 10.0% |
| **SDC** | 0.346 → 0.047 | **78.0%** |

| Real videos, by content change | DINO | SDC |
|---|---:|---:|
| All (2.14M) | 0.383 | 0.337 |
| DINO < 0.25 | 0.170 | 0.339 |
| Lowest-DINO 10% | 0.117 | 0.322 |

Human study: six professional raters rated 150 clips (real splices, natural multi-shot clips and
generated clips). SDC agrees with the mean rating at ρ = 0.68 and separates consistent from
inconsistent clips with **AUC 0.90** (95% CI [0.84, 0.95]); on real footage it reaches **AUC 0.97**.

## Release Status

- [x] Training and inference code for all three stages
- [x] Training and inference configs: [`configs/train.yaml`](configs/train.yaml), [`configs/infer.yaml`](configs/infer.yaml)
- [x] Evaluation toolkit (transition MAE, CLIP-T, TA, semantic/subject/scene, reference adherence, SDC): [`evaluation/`](evaluation)
- [x] Refrain Benchmark: 300 requests with references, image anchors and annotations (`configs/benchmark.json` + `benchmark.zip`, download link TODO)
- [x] SDC real-video calibration bank, fitted on 2.14M real videos, included in [`evaluation/assets/sdc_bank/`](evaluation/assets/sdc_bank) (4.6 MB, no download needed)
- [ ] Refrain DiT checkpoint and VAE
- [ ] DurMix-300K training data

## Installation

Linux, Python 3.12, PyTorch 2.6.0 + CUDA 12.4. Full instructions, including FlashAttention, are in
[docs/INSTALL.md](docs/INSTALL.md).

```bash
git clone https://github.com/Tencent-Hunyuan/Refrain.git && cd Refrain
python3.12 -m venv .venv && source .venv/bin/activate
pip install torch==2.6.0 torchvision==0.21.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu124
pip install -r requirements.txt
pip install --no-build-isolation --no-deps -r requirements-kernels.txt
pip install -e . --no-build-isolation --no-deps
```

## Checkpoint Preparation

```text
weights/
├── Qwen3-VL-8B-Instruct/        # public: hf download Qwen/Qwen3-VL-8B-Instruct --local-dir weights/Qwen3-VL-8B-Instruct
├── vae_3d/refrain_vae/
├── initialization/
└── evaluation/                  # metric models
```

The Refrain DiT and VAE are not released, so generation needs compatible weights of your own.
Evaluation, including SDC, works without them. Download links for every metric model are in
[docs/CHECKPOINTS.md](docs/CHECKPOINTS.md). The SDC bank is not a download: it ships with the code
in `evaluation/assets/sdc_bank/` and `tools/evaluate.sh` uses it by default.

## Quickstart

### 1. Prepare the Refrain Benchmark

```bash
unzip benchmark.zip -d .           # reference clips, image anchors, latent tensors
python tools/prepare_benchmark.py  # writes benchmark/requests.json
```

Each request lists its task type, per-shot spans, shared style prompt, per-shot descriptions, and
for every reference its source clip, source start and destination interval.
[`configs/prompt_groups.json`](configs/prompt_groups.json) fixes which V2V/TIV2V requests keep shot
descriptions (160) and which use only the reference instruction (80).

### 2. Generate

```bash
# whole benchmark
tools/infer.sh --checkpoint /path/to/refrain_dit.safetensors --output videos
# selected requests
tools/infer.sh --checkpoint /path/to/refrain_dit.safetensors --case-ids 2 65 107 --output videos-demo
# check request selection without loading the model
python tools/infer.py --checkpoint x --benchmark configs/benchmark.json --dry-run
```

Videos are written to `videos/<id>.mp4`, together with `videos.json` for evaluation.

### 3. Evaluate

```bash
tools/evaluate.sh --videos videos/videos.json --output metrics
```

This runs transition MAE, CLIP-T, semantic, regions, TA, reference semantic and SDC, and writes
`metrics/summary.csv`. Videos from other methods can be scored by listing them in the same
manifest. Details: [docs/EVALUATION.md](docs/EVALUATION.md).

### 4. Train

All three stages are defined in [`configs/train.yaml`](configs/train.yaml) as shared settings plus
per-stage overrides.

```bash
tools/train.sh text_to_video                # 0 → 19k steps, multi-shot T2V
tools/train.sh reference_training           # 19k → 36k, equal-length references
tools/train.sh variable_duration_training   # 36k → 45k, DurMix variable-length references
```

Multi-node runs use `NNODES`, `NODE_RANK`, `MASTER_ADDR` and `MASTER_PORT`. Training data are not
distributed; the expected Arrow/latent format is described in [docs/TRAINING.md](docs/TRAINING.md),
and the expected data paths in [docs/PATHS.md](docs/PATHS.md).

## Key Parameters

### Hardware

| Task | GPUs | Parallelism |
|---|---|---|
| Inference | 8 GPUs on one node | sequence parallel 8 |
| Training, stages 1–2 | 8 GPUs per node, multi-node | sequence parallel 2, FSDP hybrid sharding |
| Training, stage 3 | 8 GPUs per node, multi-node | sequence parallel 8, FSDP hybrid sharding |

### Sampling ([`configs/infer.yaml`](configs/infer.yaml))

| Key | Value | Description |
|---|---|---|
| `infer_steps_video` | `50` | Denoising steps |
| `cfg_scale_video` | `6.0` | Classifier-free guidance scale |
| `infer_flow_shift_video` | `7.0` | Flow-matching timestep shift |
| `video_fps` | `24` | Output frame rate; each request sets its own resolution and length (93–297 frames) |

### Inference options (`tools/infer.py`)

| Flag | Default | Description |
|---|---|---|
| `--checkpoint` | required | Refrain DiT weights (`.safetensors`) |
| `--case-ids` | all | Run only the listed benchmark request IDs |
| `--prompt-policy` | `prepared` | Shot text: `prepared` (as in the benchmark), `described` or `control-only` |
| `--prompt-subset` | `all` | `all`, `described160` or `control80` |
| `--reference-input` | `native-latent` | `native-latent` (cached reference tensors) or `rgb` (MP4/PNG references) |
| `--dry-run` | off | Print the selected requests without loading the model |

### Training ([`configs/train.yaml`](configs/train.yaml))

| Key | Stage 1 | Stage 2 | Stage 3 |
|---|---|---|---|
| `lr` | 1e-5 | 1e-5 | 2e-6 |
| `train_iters` (cumulative) | 19k | 36k | 45k |
| `video_index_file` | `train/t2v` | `train/references_equal` | `train/durmix` |
| `multitask_mask_training_args` | T2V 1.0 | reference 0.7 / T2V 0.3 | T2V 1.0 |
| `range_condition_temporal_pack_mode` | `legacy_trilinear` | `legacy_trilinear` | `reference_timeline` |
| `condition_dropout_prob` | 0.0 | 0.2 | 0.2 |
| `image_anchor_prob` | 0.0 | 0.8 | 0.8 |

## Repository Layout

```text
Refrain/
├── configs/
│   ├── train.yaml              # three training stages (shared + overrides)
│   ├── infer.yaml              # model + sampling settings for generation
│   ├── benchmark.json          # 300 Refrain Benchmark requests
│   ├── prompt_groups.json      # described-160 / control-80 split
│   └── metric_eligibility.json # fixed evaluation units
├── hymm/                       # model, diffusion, data and distributed runtime
│   ├── models/modules/Refrain.py   # RefrainTransformer (canvas, shot-aware RoPE)
│   ├── diffusion/              # flow-matching transport and pipeline
│   ├── dataset/                # Arrow loaders, reference-timeline packing
│   ├── parallelism/            # FSDP2 + sequence-parallel engine
│   └── train.py / inference.py
├── evaluation/                 # MAE, CLIP-T, TA, semantic/subject/scene, SDC
│   ├── style_consistency/      # SDC features, scoring and bank builder
│   └── assets/sdc_bank/        # SDC real-video calibration bank (2.14M videos)
├── tools/                      # train.sh, infer.sh, evaluate.sh, benchmark prep
├── docs/                       # install, weights, training, evaluation, runtime
└── assets/                     # figures, gallery and comparison media
```

## Acknowledgements

Refrain builds on [HunyuanVideo-1.5](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5) and uses
[Qwen3-VL](https://github.com/QwenLM/Qwen3-VL).

## Citation

```bibtex
@article{yan2026refrain,
  title   = {Refrain: Learning Multi-Shot Consistency from Inconsistent References for A$^2$O Video Generation},
  author  = {Yan, Hongru and Wu, Yue and Zhang, Jian-Wei and Xie, Liangbin and Zheng, Mingzhe and Gao, Shenghua},
  journal = {arXiv preprint arXiv:2611.27806},
  year    = {2026}
}
```
