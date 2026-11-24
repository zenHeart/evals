---
library_name: transformers
pipeline_tag: image-text-to-text
license: apache-2.0
license_link: https://huggingface.co/tencent/WeMM-Ecom-9B/blob/main/LICENSE
base_model:
- Qwen/Qwen3.5-9B
tags:
- wemm
- qwen3_5
- multimodal
- e-commerce
- conversational
language:
- zh
- en
---

<h1 align="center">WeMM-Ecom-9B</h1>

<p align="center"><b>Advancing Multimodal Content Understanding for WeChat E-Commerce</b></p>

<p align="center">
  <a href="https://huggingface.co/collections/tencent/wemm-ecom"><img src="https://img.shields.io/badge/%F0%9F%A4%97-Hugging%20Face-yellow" alt="Hugging Face Model Collection"></a>
  <a href="https://arxiv.org/abs/2611.30662"><img src="https://img.shields.io/badge/%F0%9F%93%84-Technical%20Report-red" alt="Technical Report"></a>
  <a href="https://github.com/Tencent/WeMM-Ecom"><img src="https://img.shields.io/badge/GitHub-WeMM--Ecom-black?logo=github" alt="GitHub: WeMM-Ecom"></a>
  <a href="https://huggingface.co/papers/2611.30662"><img src="https://img.shields.io/badge/%F0%9F%93%9A-Hugging%20Face%20Paper-blue" alt="Hugging Face Paper"></a>
</p>

<p align="center">
  <a href="#evaluation">Evaluation</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#best-practices">Best Practices</a>
</p>

**WeMM-Ecom-9B** is a 9B-scale dense model in the WeMM-Ecom family developed by **WeChat Vision, Tencent**. It combines fine-grained e-commerce understanding with broad visual-language and reasoning capabilities and supports **hybrid thinking**.

The WeMM-Ecom family delivers leading e-commerce performance, with WeMM-Ecom-35B-A3B outperforming open-source models with hundreds of billions of parameters. Across model sizes, it also maintains general-purpose capabilities on par with state-of-the-art models of comparable size.

## Highlights

- **E-commerce understanding:** Outperforms Qwen3.5-9B by **5.19 points** and Valley3-8B by **10.28 points** in average benchmark score.
- **Broad general capabilities:** Outperforms Qwen3.5-9B by **0.83 points** and Valley3-8B by **13.02 points** in average benchmark score.
- **Flexible deployment:** text, image, multi-image, and video inputs; BF16, FP8, GPTQ, and GGUF formats.

## Model Overview

- **Architecture:** 9B dense model.
- **Context window:** 262,144 tokens.
- **Checkpoint:** BF16 Safetensors.

**Model family:** [0.8B](https://huggingface.co/tencent/WeMM-Ecom-0.8B) · [2B](https://huggingface.co/tencent/WeMM-Ecom-2B) · [4B](https://huggingface.co/tencent/WeMM-Ecom-4B) · [9B](https://huggingface.co/tencent/WeMM-Ecom-9B) · [35B-A3B](https://huggingface.co/tencent/WeMM-Ecom-35B-A3B)

**Quantized formats:** [FP8](https://huggingface.co/tencent/WeMM-Ecom-9B-FP8) · [GPTQ](https://huggingface.co/tencent/WeMM-Ecom-9B-GPTQ) · [GGUF](https://huggingface.co/tencent/WeMM-Ecom-9B-GGUF)

## Evaluation

We evaluate e-commerce understanding on **28 benchmarks across eight scenarios** and general capabilities on **64 benchmarks across eight categories**. All scores use a 0–100 scale, with higher values indicating stronger performance.

### E-commerce Benchmarks

The suite covers product attributes, moderation, OCR, retrieval, grounding, reasoning, public e-commerce benchmarks, and product knowledge.

![WeMM-Ecom-9B e-commerce comparisons](assets/ecommerce-benchmarks.png)

<details>
<summary><b>Full e-commerce benchmark results</b></summary>

#### Instruct Mode

![WeMM-Ecom-9B Instruct Mode e-commerce results](assets/ecommerce-instruct-table.png)

#### Thinking Mode

![WeMM-Ecom-9B Thinking Mode e-commerce results](assets/ecommerce-thinking-table.png)

</details>

### General Benchmarks

The suite spans general VQA, document and chart understanding, STEM reasoning, spatial understanding, grounding and counting, multi-image understanding, instruction following, and text-centric tasks.

![WeMM-Ecom-9B general comparisons](assets/general-benchmarks.png)

<details>
<summary><b>Full general benchmark results</b></summary>

#### Instruct Mode

![WeMM-Ecom-9B Instruct Mode general results](assets/general-instruct-table.png)

#### Thinking Mode

![WeMM-Ecom-9B Thinking Mode general results](assets/general-thinking-table.png)

</details>

## Quick Start

Run WeMM-Ecom with Transformers, or use either of the [OpenAI-compatible serving options](#serving) below. Replace the local image and video paths with your own content.

> Choose sampling settings by mode and task. The examples below use the general-task settings; see [Best Practices](#best-practices) for additional recommended profiles and output budgets.

### Transformers

#### Installation

The commands below use Python 3.11 as an example environment. For other Python versions, follow the requirements of your [Transformers](https://huggingface.co/docs/transformers/installation) and [PyTorch](https://pytorch.org/get-started/locally/) releases. `uv` selects the PyTorch backend for your machine.

```bash
python3.11 -m venv .venv-transformers
source .venv-transformers/bin/activate
pip install -U pip uv
uv pip install -U "transformers>=5.2.0" accelerate torch torchvision pillow --torch-backend=auto
```

<details>
<summary>Authentication and local checkpoints</summary>

For repositories that require authentication, sign in once. You can also download a checkpoint to a local directory:

```bash
pip install -U huggingface_hub
hf auth login
hf download tencent/WeMM-Ecom-9B --local-dir ./WeMM-Ecom-9B
```

To use the downloaded checkpoint, set `model_id = "./WeMM-Ecom-9B"` in the loading example below. Both the model and processor accept the same local directory.

</details>

#### Load the Model

Load the processor and model once. The following examples share these objects and generation settings.

```python
import torch
from PIL import Image, ImageOps
from transformers import AutoModelForImageTextToText, AutoProcessor

# Apply camera orientation and use white behind transparent image regions.
def load_image(path):
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGBA")
        background = Image.new("RGBA", image.size, (255, 255, 255, 255))
        return Image.alpha_composite(background, image).convert("RGB")

model_id = "tencent/WeMM-Ecom-9B"
processor = AutoProcessor.from_pretrained(model_id)
model = AutoModelForImageTextToText.from_pretrained(
    model_id, dtype=torch.bfloat16, device_map="auto",
).eval()

enable_thinking = True
generation_kwargs = {
    "max_new_tokens": 4096,
    "do_sample": True,
    "top_k": 20,
    "min_p": 0.0,
    "repetition_penalty": 1.0,
}

def check_output_stopped(token_ids, eos_token_id):
    if type(eos_token_id) is int:
        eos_ids = {eos_token_id}
    elif isinstance(eos_token_id, list) and all(type(value) is int for value in eos_token_id):
        eos_ids = set(eos_token_id)
    else:
        raise RuntimeError("No valid EOS token IDs are configured.")
    rows = token_ids.tolist()
    if not eos_ids or not rows or any(not any(token_id in eos_ids for token_id in row) for row in rows):
        raise RuntimeError("Generation ended without an EOS token. Review max_new_tokens and generation settings.")

def split_output(text, thinking):
    if not thinking:
        if not text.strip():
            raise RuntimeError("No final answer. Review the output budget and generation settings.")
        return "", text.strip()
    reasoning, closed, answer = text.partition("</think>")
    if not closed or not answer.strip():
        raise RuntimeError("No complete final answer. Review max_new_tokens and generation settings.")
    return reasoning.removeprefix("<think>").strip(), answer.strip()
```

The examples print the final answer. In Thinking Mode, `reasoning_text` contains the reasoning and the final answer starts after `</think>`.

#### Image Understanding

Describe an image and its visible details:

```python
messages = [{
    "role": "user",
    "content": [
        {"type": "image", "image": load_image("./product.jpg")},
        {"type": "text", "text": "Briefly describe the main subjects and their visible attributes."},
    ],
}]
inputs = processor.apply_chat_template(
    messages, tokenize=True, add_generation_prompt=True,
    enable_thinking=enable_thinking,
    return_dict=True, return_tensors="pt",
).to(model.device)
with torch.inference_mode():
    outputs = model.generate(
        **inputs, **generation_kwargs,
        temperature=1.0 if enable_thinking else 0.7,
        top_p=0.95 if enable_thinking else 0.8,
    )
new_tokens = outputs[:, inputs["input_ids"].shape[1]:]
check_output_stopped(new_tokens, model.generation_config.eos_token_id)
decoded = processor.batch_decode(
    new_tokens, skip_special_tokens=True, clean_up_tokenization_spaces=False,
)[0]
reasoning_text, final_text = split_output(decoded, enable_thinking)
print(final_text)
```

#### Hybrid Thinking

- **Instruct Mode:** set `enable_thinking=False` for a direct response; use `temperature=0.7` and `top_p=0.8`.
- **Thinking Mode:** set `enable_thinking=True` for reasoning followed by the final answer; use `temperature=1.0` and `top_p=0.95`.

The checkpoint default is **Thinking Mode**. All examples pass the switch explicitly. To change modes, update `enable_thinking`; the conditional sampling arguments in each `generate()` call follow it automatically.

<details>
<summary>Text-only Conversations</summary>

```python
messages = [{"role": "user", "content": [{
    "type": "text", "text": "List the key attributes used to distinguish product variants.",
}]}]
inputs = processor.apply_chat_template(
    messages, tokenize=True, add_generation_prompt=True,
    enable_thinking=enable_thinking,
    return_dict=True, return_tensors="pt",
).to(model.device)
with torch.inference_mode():
    outputs = model.generate(
        **inputs, **generation_kwargs,
        temperature=1.0 if enable_thinking else 0.7,
        top_p=0.95 if enable_thinking else 0.8,
    )
new_tokens = outputs[:, inputs["input_ids"].shape[1]:]
check_output_stopped(new_tokens, model.generation_config.eos_token_id)
decoded = processor.batch_decode(
    new_tokens, skip_special_tokens=True, clean_up_tokenization_spaces=False,
)[0]
reasoning_text, final_text = split_output(decoded, enable_thinking)
print(final_text)
```

</details>

<details>
<summary>Multi-Image Understanding</summary>

Provide multiple product views in one conversation:

```python
messages = [{"role": "user", "content": [
    {"type": "image", "image": load_image("./product_front.jpg")},
    {"type": "image", "image": load_image("./product_back.jpg")},
    {"type": "text", "text": "Compare these views and extract the visible variant attributes."},
]}]
inputs = processor.apply_chat_template(
    messages, tokenize=True, add_generation_prompt=True,
    enable_thinking=enable_thinking,
    return_dict=True, return_tensors="pt",
).to(model.device)
with torch.inference_mode():
    outputs = model.generate(
        **inputs, **generation_kwargs,
        temperature=1.0 if enable_thinking else 0.7,
        top_p=0.95 if enable_thinking else 0.8,
    )
new_tokens = outputs[:, inputs["input_ids"].shape[1]:]
check_output_stopped(new_tokens, model.generation_config.eos_token_id)
decoded = processor.batch_decode(
    new_tokens, skip_special_tokens=True, clean_up_tokenization_spaces=False,
)[0]
reasoning_text, final_text = split_output(decoded, enable_thinking)
print(final_text)
```

</details>

<details>
<summary>Video Understanding</summary>

Install a TorchCodec build compatible with your PyTorch installation, and make its supported FFmpeg shared libraries available in the same environment. Follow the [TorchCodec installation guide and compatibility table](https://github.com/meta-pytorch/torchcodec#installing-torchcodec).

```bash
pip install torchcodec
```

Check the decoder with your local clip before running the example:

```python
from torchcodec.decoders import VideoDecoder

decoder = VideoDecoder("./product_demo.mp4", device="cpu")
print(len(decoder), decoder[0].shape)
```

This example samples 16 frames from a product demonstration:

```python
messages = [{"role": "user", "content": [
    {"type": "video", "path": "./product_demo.mp4"},
    {"type": "text", "text": "Summarize the product features and actions demonstrated in this clip."},
]}]
inputs = processor.apply_chat_template(
    messages, tokenize=True, add_generation_prompt=True,
    enable_thinking=enable_thinking, num_frames=16, fps=None,
    return_dict=True, return_tensors="pt",
).to(model.device)
with torch.inference_mode():
    outputs = model.generate(
        **inputs, **generation_kwargs,
        temperature=1.0 if enable_thinking else 0.7,
        top_p=0.95 if enable_thinking else 0.8,
    )
new_tokens = outputs[:, inputs["input_ids"].shape[1]:]
check_output_stopped(new_tokens, model.generation_config.eos_token_id)
decoded = processor.batch_decode(
    new_tokens, skip_special_tokens=True, clean_up_tokenization_spaces=False,
)[0]
reasoning_text, final_text = split_output(decoded, enable_thinking)
print(final_text)
```

For rate-based sampling, replace `num_frames=16, fps=None` with `fps=2.0` and omit `num_frames`.

</details>

<details>
<summary>Batched Inference</summary>

Pass a list of conversations and use left padding. Crop generated tokens at the common padded input width.

```python
processor.tokenizer.padding_side = "left"
batch_messages = [
    [{"role": "user", "content": [
        {"type": "image", "image": load_image("./product_front.jpg")},
        {"type": "text", "text": "Extract the visible product attributes."},
    ]}],
    [{"role": "user", "content": [{
        "type": "text", "text": "Explain the difference between a product and an SKU.",
    }]}],
]
inputs = processor.apply_chat_template(
    batch_messages, tokenize=True, add_generation_prompt=True,
    enable_thinking=enable_thinking, padding=True,
    return_dict=True, return_tensors="pt",
).to(model.device)
with torch.inference_mode():
    outputs = model.generate(
        **inputs, **generation_kwargs,
        temperature=1.0 if enable_thinking else 0.7,
        top_p=0.95 if enable_thinking else 0.8,
    )
new_tokens = outputs[:, inputs["input_ids"].shape[1]:]
check_output_stopped(new_tokens, model.generation_config.eos_token_id)
decoded_batch = processor.batch_decode(
    new_tokens, skip_special_tokens=True, clean_up_tokenization_spaces=False,
)
for decoded in decoded_batch:
    reasoning_text, final_text = split_output(decoded, enable_thinking)
    print(final_text)
```

</details>

<details>
<summary>Multi-turn Conversations</summary>

Keep the media references in the conversation history and append only the final answer from each assistant turn.

```python
turns = [
    [{"type": "image", "image": load_image("./product.jpg")},
     {"type": "text", "text": "Describe this product's visible attributes."}],
    [{"type": "text", "text": "Which attributes should be included in the product title?"}],
]
messages = []
for content in turns:
    messages.append({"role": "user", "content": content})
    inputs = processor.apply_chat_template(
        messages, tokenize=True, add_generation_prompt=True,
        enable_thinking=enable_thinking,
        return_dict=True, return_tensors="pt",
    ).to(model.device)
    with torch.inference_mode():
        outputs = model.generate(
            **inputs, **generation_kwargs,
            temperature=1.0 if enable_thinking else 0.7,
            top_p=0.95 if enable_thinking else 0.8,
        )
    new_tokens = outputs[:, inputs["input_ids"].shape[1]:]
    check_output_stopped(new_tokens, model.generation_config.eos_token_id)
    decoded = processor.batch_decode(
        new_tokens, skip_special_tokens=True, clean_up_tokenization_spaces=False,
    )[0]
    reasoning_text, final_text = split_output(decoded, enable_thinking)
    if not final_text:
        break
    print(final_text)
    messages.append({"role": "assistant", "content": [{"type": "text", "text": final_text}]})
```

</details>

<details>
<summary>Visual Input Settings</summary>

The image processor accepts pixel-area bounds through `images_kwargs`. This example uses a 64–1280 visual-token image budget; the checkpoint's defaults remain available by omitting this override.

```python
spatial_factor = processor.image_processor.patch_size * processor.image_processor.merge_size
messages = [{"role": "user", "content": [
    {"type": "image", "image": load_image("./product.jpg")},
    {"type": "text", "text": "Describe the visible objects and their attributes. Report only text that is clearly legible."},
]}]
inputs = processor.apply_chat_template(
    messages, tokenize=True, add_generation_prompt=True,
    enable_thinking=enable_thinking,
    images_kwargs={"size": {
        "shortest_edge": 64 * spatial_factor ** 2,
        "longest_edge": 1280 * spatial_factor ** 2,
    }},
    return_dict=True, return_tensors="pt",
).to(model.device)
with torch.inference_mode():
    outputs = model.generate(
        **inputs, **generation_kwargs,
        temperature=1.0 if enable_thinking else 0.7,
        top_p=0.95 if enable_thinking else 0.8,
    )
new_tokens = outputs[:, inputs["input_ids"].shape[1]:]
check_output_stopped(new_tokens, model.generation_config.eos_token_id)
decoded = processor.batch_decode(
    new_tokens, skip_special_tokens=True, clean_up_tokenization_spaces=False,
)[0]
reasoning_text, final_text = split_output(decoded, enable_thinking)
print(final_text)
```

</details>

<details>
<summary>Optional FlashAttention 2</summary>

For a compatible CUDA setup, follow the [FlashAttention installation instructions](https://github.com/Dao-AILab/flash-attention#installation-and-features), then replace the model-loading call above with:

```python
model = AutoModelForImageTextToText.from_pretrained(
    model_id, dtype=torch.bfloat16, device_map="auto",
    attn_implementation="flash_attention_2",
).eval()
```

</details>

## Serving

Choose vLLM or SGLang and install the engine in its own Python environment. Both expose the client API shown below.

The commands use a 32,768-token serving context. The model's native context window is **262,144 tokens**. Adjust `--max-model-len` for vLLM or `--context-length` for SGLang, together with tensor parallelism, for your deployment.

### vLLM

See the [vLLM installation guide](https://docs.vllm.ai/en/latest/getting_started/installation/gpu/) for the requirements of your chosen release. The commands below use a separate Python 3.11 environment.

```bash
python3.11 -m venv .venv-vllm
source .venv-vllm/bin/activate
pip install -U pip uv
uv pip install -U "vllm>=0.31.0" openai --torch-backend=auto

MODEL=tencent/WeMM-Ecom-9B
vllm serve "$MODEL" \
    --served-model-name "$MODEL" \
    --tensor-parallel-size 1 \
    --max-model-len 32768 \
    --reasoning-parser qwen3 \
    --port 8000
```

### SGLang

We recommend **SGLang 0.5.15 or newer**. Use a fresh environment with matching CUDA/PyTorch builds of SGLang and its kernel dependencies, following the [SGLang installation guide](https://docs.sglang.io/docs/get-started/install.md).

```bash
python3.11 -m venv .venv-sglang
source .venv-sglang/bin/activate
pip install -U pip uv
uv pip install -U "sglang>=0.5.15" openai decord

MODEL=tencent/WeMM-Ecom-9B
python -m sglang.launch_server \
    --model-path "$MODEL" \
    --served-model-name "$MODEL" \
    --tp-size 1 \
    --mem-fraction-static 0.8 \
    --context-length 32768 \
    --reasoning-parser qwen3 \
    --port 8000
```

### OpenAI-compatible API

Install the client where you send requests:

```bash
pip install -U openai pillow
```

Set `enable_thinking` before constructing the shared request settings; rerun this setup when changing modes. Local media are encoded in the client so the server does not need access to their file paths.

```python
import base64
import io
from pathlib import Path
from PIL import Image, ImageOps
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="EMPTY")
enable_thinking = True
request_kwargs = {
    "model": "tencent/WeMM-Ecom-9B",
    "max_completion_tokens": 4096,
    "temperature": 1.0 if enable_thinking else 0.7,
    "top_p": 0.95 if enable_thinking else 0.8,
    "presence_penalty": 1.5,
    "extra_body": {
        "top_k": 20, "min_p": 0.0, "repetition_penalty": 1.0,
        "chat_template_kwargs": {"enable_thinking": enable_thinking},
    },
}

def media_url(path, mime_type):
    if mime_type.startswith("image/"):
        with Image.open(path) as source:
            image = ImageOps.exif_transpose(source).convert("RGBA")
            background = Image.new("RGBA", image.size, (255, 255, 255, 255))
            image = Image.alpha_composite(background, image).convert("RGB")
            buffer = io.BytesIO()
            image.save(buffer, format="PNG")
            data = buffer.getvalue()
        mime_type = "image/png"
    else:
        data = Path(path).read_bytes()
    encoded = base64.b64encode(data).decode("ascii")
    return f"data:{mime_type};base64,{encoded}"

def show_response(response):
    choice = response.choices[0]
    message = choice.message
    if choice.finish_reason == "length" or not (message.content or "").strip():
        raise RuntimeError("No complete final answer. Review max_completion_tokens and generation settings.")
    reasoning = getattr(message, "reasoning", None) or getattr(message, "reasoning_content", None)
    if reasoning:
        print("Reasoning:\n" + reasoning)
    answer = message.content or ""
    print("Answer:\n" + answer)
    return answer
```

#### Image Requests

```python
messages = [{"role": "user", "content": [
    {"type": "image_url", "image_url": {"url": media_url("./product.jpg", "image/jpeg")}},
    {"type": "text", "text": "Describe this product and extract its visible attributes."},
]}]
response = client.chat.completions.create(messages=messages, **request_kwargs)
final_text = show_response(response)
```

<details>
<summary>Text Requests</summary>

```python
messages = [{"role": "user", "content": "List five attributes that distinguish product variants."}]
response = client.chat.completions.create(messages=messages, **request_kwargs)
final_text = show_response(response)
```

</details>

<details>
<summary>Multi-Image Requests</summary>

```python
messages = [{"role": "user", "content": [
    {"type": "image_url", "image_url": {"url": media_url("./product_front.jpg", "image/jpeg")}},
    {"type": "image_url", "image_url": {"url": media_url("./product_back.jpg", "image/jpeg")}},
    {"type": "text", "text": "Compare these product views and extract the visible attributes."},
]}]
response = client.chat.completions.create(messages=messages, **request_kwargs)
final_text = show_response(response)
```

</details>

<details>
<summary>Video Requests</summary>

Use the engines' `video_url` input with a local MP4 clip:

```python
messages = [{"role": "user", "content": [
    {"type": "video_url", "video_url": {"url": media_url("./product_demo.mp4", "video/mp4")}},
    {"type": "text", "text": "Summarize the visible events in this product demonstration."},
]}]
response = client.chat.completions.create(messages=messages, **request_kwargs)
final_text = show_response(response)
```

</details>

<details>
<summary>Multi-turn Requests</summary>

Send the conversation history with each request and keep only the final answer in assistant messages.

```python
turns = [
    [{"type": "image_url", "image_url": {"url": media_url("./product.jpg", "image/jpeg")}},
     {"type": "text", "text": "Describe this product's visible attributes."}],
    "Which details should be included in the product title?",
]
history = []
for content in turns:
    history.append({"role": "user", "content": content})
    response = client.chat.completions.create(messages=history, **request_kwargs)
    final_text = show_response(response)
    if not final_text:
        break
    history.append({"role": "assistant", "content": final_text})
```

</details>

<details>
<summary>Streaming Responses</summary>

```python
messages = [{"role": "user", "content": [
    {"type": "image_url", "image_url": {"url": media_url("./product.jpg", "image/jpeg")}},
    {"type": "text", "text": "Describe this product and extract its visible attributes."},
]}]
stream = client.chat.completions.create(messages=messages, stream=True, **request_kwargs)
channel = None
finish_reason = None
answer_parts = []
for chunk in stream:
    if not chunk.choices:
        continue
    choice = chunk.choices[0]
    finish_reason = choice.finish_reason or finish_reason
    delta = choice.delta
    if delta.content:
        answer_parts.append(delta.content)
    reasoning = getattr(delta, "reasoning", None) or getattr(delta, "reasoning_content", None)
    for label, text in [("Reasoning", reasoning), ("Answer", delta.content)]:
        if not text:
            continue
        if label != channel:
            print(f"\n{label}:\n", end="")
            channel = label
        print(text, end="", flush=True)
print()
if finish_reason == "length" or not "".join(answer_parts).strip():
    raise RuntimeError("No complete final answer. Review max_completion_tokens and generation settings.")
```

</details>

## Best Practices

### Sampling Parameters

Use the following sampling profiles according to the mode and task.

- **Instruct Mode — general tasks:** `temperature=0.7`, `top_p=0.8`, `top_k=20`, `min_p=0.0`, `presence_penalty=1.5`, `repetition_penalty=1.0`.
- **Instruct Mode — structured outputs, such as attribute selection, product detection, and SKU matching:** `temperature=0.7`, `top_p=0.8`, `top_k=20`, `min_p=0.0`, `presence_penalty=0.0`, `repetition_penalty=1.0`.
- **Instruct Mode — reasoning tasks:** `temperature=1.0`, `top_p=1.0`, `top_k=40`, `min_p=0.0`, `presence_penalty=2.0`, `repetition_penalty=1.0`.
- **Thinking Mode — general tasks:** `temperature=1.0`, `top_p=0.95`, `top_k=20`, `min_p=0.0`, `presence_penalty=1.5`, `repetition_penalty=1.0`.
- **Thinking Mode — OCR, entity recognition, and SKU matching:** `temperature=1.0`, `top_p=0.95`, `top_k=20`, `min_p=0.0`, `presence_penalty=2.0`, `repetition_penalty=1.05`.

Use the OpenAI-compatible examples to apply all listed parameters. Pass `temperature`, `top_p`, and `presence_penalty` directly, and put `top_k`, `min_p`, and `repetition_penalty` in `extra_body`. The native Transformers examples use `do_sample=True` and omit `presence_penalty` from `generate()`.

### Mode and Output Settings

- **Select the mode explicitly:** use `enable_thinking=False` for Instruct Mode and `enable_thinking=True` for Thinking Mode. In the serving API, pass this switch through `chat_template_kwargs` in `extra_body`.
- **Allow enough output tokens:** the Quick Start uses **4,096 tokens** for a compact example. Allow a larger budget for longer reasoning; in Thinking Mode, this budget covers both reasoning and the final answer. Set `max_new_tokens` in Transformers or `max_completion_tokens` in the serving API. The serving context limit must accommodate both the input and the generated output.
- **Specify the output format:** for extraction, matching, and grounding, state the required fields, labels, and coordinate format. For multiple-choice tasks, request a clear final answer. In multi-turn conversations, append the assistant's final answer to the history.

## Citation

If you find WeMM-Ecom useful, please consider starring our [GitHub repository](https://github.com/Tencent/WeMM-Ecom) and citing our technical report.

```bibtex
@misc{wemm-ecom-2026,
  title = {WeMM-Ecom: Advancing Multimodal Content Understanding for WeChat E-Commerce},
  author = {Binhui Xie and Jinmin Li and Haomiao Tang and Guangting Wang and Song Jin and Jianwei Zhu and Fengyun Rao and Jing Lyu},
  year = {2026},
  eprint = {2611.30662},
  archivePrefix = {arXiv},
  primaryClass = {cs.AI},
  url = {https://arxiv.org/abs/2611.30662}
}
```

## License

The model weights are licensed under Apache-2.0, except for the third-party components listed in [LICENSE](LICENSE), which retain their respective original licenses. See that file for the full terms, notices, and dependencies.

## Acknowledgements

We thank the Qwen team for the Qwen3.5 foundation and the open-source community for the tools and benchmarks used in this project.
