# Tiny Wins icon v2 (cute). Original artwork from plain shapes. Two candidates: A "sprout buddy", B "cushion steps + happy star".
import math
INK='#34495f'; SAGE='#9bb89a'; SAGE_L='#bcd3b6'; SAGE_D='#7f9f80'; SAND='#f6f0e4'; SAND_D='#e4d9c4'; BUTTER='#f8d977'; BUTTER_D='#efc457'; PEACH='#f5b79f'
BG_T,BG_B='#6d8aa9','#4a6580'
def defs(uid=''):
    return f'''<defs>
<linearGradient id="bg{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BG_T}"/><stop offset="1" stop-color="{BG_B}"/></linearGradient>
<radialGradient id="hl{uid}" cx=".3" cy=".18" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="sand{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="{SAND_D}"/></linearGradient>
<linearGradient id="sage{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{SAGE_L}"/><stop offset="1" stop-color="{SAGE_D}"/></linearGradient>
<linearGradient id="but{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde99a"/><stop offset="1" stop-color="{BUTTER_D}"/></linearGradient>
</defs>'''
def sparkle(cx,cy,r,fill=BUTTER):
    return f'<path d="M{cx} {cy-r}Q{cx+r*.12} {cy-r*.12} {cx+r} {cy}Q{cx+r*.12} {cy+r*.12} {cx} {cy+r}Q{cx-r*.12} {cy+r*.12} {cx-r} {cy}Q{cx-r*.12} {cy-r*.12} {cx} {cy-r}Z" fill="{fill}"/>'
def face(cx,cy,gap,er,smile,blush=True,sw=9,by=None,bx=None,col=INK):
    s=f'<circle cx="{cx-gap}" cy="{cy}" r="{er}" fill="{col}"/><circle cx="{cx+gap}" cy="{cy}" r="{er}" fill="{col}"/>'
    s+=f'<path d="M{cx-smile} {cy+er*1.9}Q{cx} {cy+er*1.9+smile*1.1} {cx+smile} {cy+er*1.9}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/>'
    if blush:
        bx=bx or gap*1.75; by=by or cy+er*2.2
        s+=f'<ellipse cx="{cx-bx}" cy="{by}" rx="{er*1.8}" ry="{er*1.1}" fill="{PEACH}" opacity=".75"/><ellipse cx="{cx+bx}" cy="{by}" rx="{er*1.8}" ry="{er*1.1}" fill="{PEACH}" opacity=".75"/>'
    return s
def glyph_A(small=False,mono=False,u=''):
    if mono:
        return f'''<mask id="mk{u}"><rect width="512" height="512" fill="#fff"/><g fill="#000"><circle cx="214" cy="274" r="12"/><circle cx="298" cy="274" r="12"/></g><path d="M236 300Q256 322 276 300" fill="none" stroke="#000" stroke-width="10" stroke-linecap="round"/></mask>
<g fill="#fff"><rect x="120" y="352" width="272" height="92" rx="46"/><g mask="url(#mk{u})"><ellipse cx="256" cy="268" rx="122" ry="106"/></g><path d="M256 190V146" stroke="#fff" stroke-width="16" stroke-linecap="round"/><path d="M256 150C256 104 300 82 340 92C342 134 300 164 256 150Z"/><path d="M256 162C256 126 220 108 186 116C186 152 220 174 256 162Z"/></g>'''
    if small:
        return f'''<rect x="104" y="350" width="304" height="100" rx="50" fill="url(#sage{u})"/>
<ellipse cx="256" cy="262" rx="140" ry="122" fill="url(#sand{u})"/>
<path d="M256 150V112" stroke="{SAGE_D}" stroke-width="20" stroke-linecap="round"/><path d="M256 126C256 74 304 50 352 60C354 106 306 140 256 126Z" fill="{SAGE}"/><path d="M256 140C256 98 214 78 172 88C172 130 214 154 256 140Z" fill="{SAGE_L}"/>
<circle cx="208" cy="262" r="16" fill="{INK}"/><circle cx="304" cy="262" r="16" fill="{INK}"/><path d="M226 298Q256 330 286 298" fill="none" stroke="{INK}" stroke-width="14" stroke-linecap="round"/>
{sparkle(410,110,40)}'''
    return f'''<rect x="120" y="352" width="272" height="92" rx="46" fill="url(#sage{u})"/>
<ellipse cx="256" cy="268" rx="122" ry="106" fill="url(#sand{u})"/>
<ellipse cx="214" cy="226" rx="38" ry="16" fill="#fff" opacity=".55" transform="rotate(-18 214 226)"/>
<path d="M256 192V148" stroke="{SAGE_D}" stroke-width="15" stroke-linecap="round"/>
<path d="M256 150C256 104 300 82 340 92C342 134 300 164 256 150Z" fill="{SAGE}"/><path d="M256 162C256 126 220 108 186 116C186 152 220 174 256 162Z" fill="{SAGE_L}"/>
{face(256,276,42,11,22,True,9,by=300,bx=74)}
{sparkle(398,128,34)}{sparkle(130,150,16,'#fff')}'''
def star_pts(cx,cy,R,r,rot=-90):
    p=[]
    for i in range(10):
        a=math.radians(rot+i*36);rad=R if i%2==0 else r
        p.append(f'{cx+rad*math.cos(a):.1f},{cy+rad*math.sin(a):.1f}')
    return ' '.join(p)
def glyph_B(small=False,mono=False,u='',tiny=False):
    if small or tiny:
        sx,sy,R,r=350,130,80,44; dy=14
        CU=[(64,350,384,96),(160,274,288,96),(256,198,192,96)]
    else:
        sx,sy,R,r=352,142,74,40; dy=0
        CU=[(76,364,360,82),(172,290,264,86),(268,216,168,86)]
    if mono:
        return f'''<mask id="mk{u}"><rect width="512" height="512" fill="#fff"/><g fill="#000"><circle cx="{sx-17}" cy="{sy+4}" r="8"/><circle cx="{sx+17}" cy="{sy+4}" r="8"/></g><path d="M{sx-13} {sy+22}Q{sx} {sy+36} {sx+13} {sy+22}" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round"/></mask>
<g fill="#fff">{"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2}"/>' for x,y,w,h in CU)}<g mask="url(#mk{u})"><polygon points="{star_pts(sx,sy,R,r)}" stroke="#fff" stroke-width="26" stroke-linejoin="round"/></g></g>'''
    cush=lambda x,y,w,h,fill,hi=True: f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2}" fill="url(#{fill}{u})"/>'+(f'<rect x="{x+h*.35}" y="{y+h*.14}" width="{w-h*.7}" height="{h*.16}" rx="{h*.08}" fill="#fff" opacity=".55"/>' if hi and not tiny else '')
    out=cush(*CU[0],'sand')+cush(*CU[1],'sage')+cush(*CU[2],'sand')
    out+=f'<polygon points="{star_pts(sx,sy,R,r)}" fill="url(#but{u})" stroke="url(#but{u})" stroke-width="{24 if (small or tiny) else 26}" stroke-linejoin="round"/>'
    if tiny: pass
    elif small:
        out+=f'<circle cx="{sx-17}" cy="{sy+4}" r="10" fill="{INK}"/><circle cx="{sx+17}" cy="{sy+4}" r="10" fill="{INK}"/><path d="M{sx-14} {sy+26}Q{sx} {sy+42} {sx+14} {sy+26}" fill="none" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>'
    else:
        out+=face(sx,sy+2,17,7.5,13,True,7,by=sy+30,bx=30)
        out+=sparkle(150,246,16,BUTTER)
    if dy: out=f'<g transform="translate(0 {dy})">{out}</g>'
    return out
GL={'A':glyph_A,'B':glyph_B}
def g(s,inner,dy=0): return f'<g transform="translate(256 256) scale({s}) translate(-256 -256) translate(0 {dy})">{inner}</g>'
def svg(design,kind):
    G=GL[design]; h='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'; D=defs()
    bg=lambda rx,x=0,y=0,w=512,hh=512: f'<rect x="{x}" y="{y}" width="{w}" height="{hh}" rx="{rx}" fill="url(#bg)"/><rect x="{x}" y="{y}" width="{w}" height="{hh}" rx="{rx}" fill="url(#hl)"/>'
    if kind=='any': return h+D+bg(140)+G()+'</svg>'
    if kind=='small': return h+D+bg(140)+G(small=True)+'</svg>'
    if kind=='tiny': return h+D+bg(140)+(G(tiny=True) if design=='B' else G(small=True))+'</svg>'
    if kind=='full': return h+D+bg(0)+G()+'</svg>'
    if kind=='maskable': return h+D+bg(0)+g(0.8,G())+'</svg>'
    if kind=='fg': return h+D+g(0.66,G())+'</svg>'
    if kind=='mac': return h+D+bg(112,50,50,412,412)+g(0.78,G())+'</svg>'
    if kind=='mono': return h+g(0.66,G(mono=True))+'</svg>'
if __name__=='__main__':
    for d in 'AB':
        for k in ['any','small','tiny','full','maskable','fg','mac','mono']: open(f'/workspace/iconwork2/{d}_{k}.svg','w').write(svg(d,k))
