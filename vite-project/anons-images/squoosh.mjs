#!/usr/bin/env zx

await $`mkdir -p compressed`

const compress = file =>
  $`squoosh-cli --webp '{"quality":75,"target_size":0,"target_PSNR":0,"method":4,"sns_strength":50,"filter_strength":60,"filter_sharpness":0,"filter_type":1,"partitions":0,"segments":4,"pass":1,"show_compressed":0,"preprocessing":0,"autofilter":0,"partition_limit":0,"alpha_compression":1,"alpha_filtering":1,"alpha_quality":100,"lossless":1,"exact":0,"image_hint":0,"emulate_jpeg_size":0,"thread_level":0,"low_memory":0,"near_lossless":100,"use_delta_palette":0,"use_sharp_yuv":0}' -d compressed/ ${file}`

await compress(await glob('source/*0.png'))
await compress(await glob('source/*1.png'))
await compress(await glob('source/*2.png'))
await compress(await glob('source/*3.png'))
await compress(await glob('source/*4.png'))
await compress(await glob('source/*5.png'))
await compress(await glob('source/*6.png'))
await compress(await glob('source/*7.png'))
await compress(await glob('source/*8.png'))
await compress(await glob('source/*9.png'))
