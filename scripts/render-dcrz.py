"""Generate README GIFs with Node.js and Pillow 11.3.0.

Run: python3 scripts/render-dcrz.py
Uses Arial/Menlo on macOS or Liberation/DejaVu on Linux.
"""
import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
W, H, AA = 600, 240, 2

def font(size, kind='regular'):
    paths = {
        'regular': ['/System/Library/Fonts/Supplemental/Arial.ttf', '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'],
        'bold': ['/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf'],
        'mono': ['/System/Library/Fonts/Menlo.ttc', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'],
    }
    return ImageFont.truetype(next(p for p in paths[kind] if Path(p).exists()), size * AA)

def rgb(color):
    return tuple(int(color[i:i+2], 16) for i in (1, 3, 5))

def blend(a, b, amount):
    return tuple(round(x+(y-x)*amount) for x,y in zip(a,b))

def tracked(draw, text, xy, face, color, spacing):
    x, y = [v*AA for v in xy]
    for ch in text:
        draw.text((x, y), ch, font=face, fill=color, anchor='ls')
        x += draw.textlength(ch, font=face) + spacing*AA

themes = {}
for theme in ['dark', 'light']:
    c = dict(zip(['outer','bg','border','text','muted','purple','green'],
        ['#0d1117','#121923','#293342','#f0eee9','#acb5c3','#c3b4fa','#a0dac5'] if theme == 'dark' else
        ['#ffffff','#f0eee9','#d8d6de','#20232c','#565f6d','#7554b6','#276954']))
    c = {k:rgb(v) for k,v in c.items()}
    base = Image.new('RGB', (W*AA,H*AA), c['outer'])
    d = ImageDraw.Draw(base)
    d.rounded_rectangle((AA,AA,598*AA,238*AA), radius=16*AA, fill=c['bg'], outline=c['border'], width=AA)
    tracked(d,'01 / IMMERSIVE WEB',(26,34),font(12,'mono'),c['muted'],.6)
    tracked(d,'DCRZ',(25,119),font(62,'bold'),c['text'],-3)
    tracked(d,'STUDIO',(29,151),font(22,'mono'),c['purple'],5)
    d.line((26*AA,198*AA,574*AA,198*AA),fill=c['border'],width=AA)
    tracked(d,'360° EXPERIENCES',(28,223),font(12,'mono'),c['muted'],1)
    d.line((551*AA,224*AA,573*AA,202*AA),fill=c['green'],width=2*AA)
    d.line((563*AA,202*AA,573*AA,202*AA,573*AA,212*AA),fill=c['green'],width=2*AA)
    colors = list(c.values())
    for target in [c['purple'],c['green'],c['text'],c['muted'],(255,255,255)]:
        colors.extend(blend(c['bg'],target,i/47) for i in range(48))
    colors = list(dict.fromkeys(colors))[:256]
    pal = Image.new('P',(1,1))
    values = [v for col in colors for v in col]
    pal.putpalette(values+[0]*(768-len(values)))
    themes[theme] = {'base':base,'colors':c,'palette':pal,'frames':[],'cache':{}}

def scaled_point(p):
    return ((p[0]+221)*AA,(p[1]+3)*AA)

proc = subprocess.Popen(['node', str(ROOT/'scripts/export-dcrz.cjs')], stdout=subprocess.PIPE, text=True)
for i, raw in enumerate(proc.stdout):
    commands = json.loads(raw)
    for theme,state in themes.items():
        im = state['base'].copy(); d = ImageDraw.Draw(im); c=state['colors']
        for command in commands:
            op=command[0]
            if op=='g':
                g,alpha=command[1:]; x,y=scaled_point((g['x'],g['y'])); r=g['r']*AA
                for step in range(18,0,-1):
                    rr=r*step/18
                    color=blend(c['bg'],(230,255,246),alpha*(1-step/19)**2*.65)
                    d.ellipse((x-rr,y-rr,x+rr,y+rr),fill=color)
                continue
            _,geometry,color,alpha,*rest=command
            key=(color,alpha)
            if key not in state['cache']:
                ink= c['purple'] if color in ['#c3b4fa','#c3b0ef'] else c['green'] if color in ['#a0dac5','#9ddbc9'] else rgb(color[:7])
                state['cache'][key]=blend(c['bg'],ink,alpha)
            ink=state['cache'][key]
            if op=='l':
                d.line([scaled_point(p) for p in geometry],fill=ink,width=max(1,round(rest[0]*AA)))
            elif op=='c':
                x,y=scaled_point(geometry);r=geometry[2]*AA
                d.ellipse((x-r,y-r,x+r,y+r),fill=ink)
            elif op=='p':
                d.polygon([scaled_point(p) for p in geometry],fill=ink)
        im=im.resize((W,H),Image.Resampling.LANCZOS)
        if i==128: im.save(ASSETS/f'project-dcrz-{theme}-still.png')
        state['frames'].append(im.quantize(palette=state['palette'],dither=Image.Dither.NONE))
    if i%200==0: print(f'{i}/854 frames',flush=True)
if proc.wait()!=0: raise RuntimeError('Scene renderer failed')
for theme,state in themes.items():
    frames=state['frames']; target=ASSETS/f'project-dcrz-{theme}.gif'
    frames[0].save(target,save_all=True,append_images=frames[1:],duration=50,loop=0,disposal=1,optimize=True)
    print(f'{theme}: {target.stat().st_size/1024/1024:.2f} MiB',flush=True)
