import sherpa_onnx, wave, numpy as np, sys
D='/tmp/tts/sherpa-onnx-supertonic-tts-int8-2026-03-06'
st=sherpa_onnx.OfflineTtsSupertonicModelConfig(duration_predictor=f'{D}/duration_predictor.int8.onnx',text_encoder=f'{D}/text_encoder.int8.onnx',vector_estimator=f'{D}/vector_estimator.int8.onnx',vocoder=f'{D}/vocoder.int8.onnx',tts_json=f'{D}/tts.json',unicode_indexer=f'{D}/unicode_indexer.bin',voice_style=f'{D}/voice.bin')
tts=sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(supertonic=st,num_threads=8)))
def say(text,out,sid=0,speed=1.05,steps=8):
    g=sherpa_onnx.GenerationConfig(); g.sid=sid; g.speed=speed; g.num_steps=steps; g.extra={'lang':'ko'}
    a=tts.generate(text,g)
    s=(np.clip(np.array(a.samples),-1,1)*32767).astype(np.int16)
    w=wave.open(out,'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(a.sample_rate);w.writeframes(s.tobytes());w.close()
    return len(s)/a.sample_rate
if __name__=='__main__':
    print(tts.num_speakers)
    for sid in range(min(tts.num_speakers,10)):
        print(sid, say('안녕하세요. 오늘은 AI를 활용해서 합격하는 자기소개서를 쓰는 방법을 알아보겠습니다.',f'sp{sid}.wav',sid=sid))
