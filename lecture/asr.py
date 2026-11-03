import sherpa_onnx, wave, numpy as np, sys
A='/tmp/tts/sherpa-onnx-zipformer-korean-2024-06-24'
r=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f'{A}/encoder-epoch-99-avg-1.int8.onnx',decoder=f'{A}/decoder-epoch-99-avg-1.int8.onnx',joiner=f'{A}/joiner-epoch-99-avg-1.int8.onnx',tokens=f'{A}/tokens.txt',num_threads=8)
for f in sys.argv[1:]:
    w=wave.open(f);sr=w.getframerate();x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
    s=r.create_stream();s.accept_waveform(sr,x);r.decode_stream(s);print(f,s.result.text)
