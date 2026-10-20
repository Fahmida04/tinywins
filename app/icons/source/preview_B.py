from PIL import Image,ImageDraw,ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans'
f=ImageFont.truetype(F+'.ttf',17);fb=ImageFont.truetype(F+'-Bold.ttf',22)
L=lambda k:Image.open(f'/workspace/iconwork2/B_{k}-1024.png')
big,small,tiny,mask,mac=L('any'),L('small'),L('tiny'),L('maskable'),L('mac')
def pick(n): return tiny if n<=32 else small if n<=48 else big
im=Image.new('RGB',(1500,900),'#f3f1ec');d=ImageDraw.Draw(im);d.rectangle([750,0,1500,900],fill='#10161f')
for x0,bg,fg,lab in ((0,'#f3f1ec','#4e6a85','Tiny Wins icon (B: cushion steps + happy star)'),(750,'#10161f','#c8d3dd','dark background')):
    t=big.resize((400,400),Image.LANCZOS);im.paste(t,(x0+175,60),t);d.text((x0+30,20),lab,fill=fg,font=fb)
    y=500;x=x0+40
    for n in (128,64,48,32,24,16):
        t=pick(n).resize((n,n),Image.LANCZOS);im.paste(t,(x,y+(128-n)//2),t);d.text((x,y+138),str(n),fill=fg,font=f);x+=n+34
    z=tiny.resize((16,16),Image.LANCZOS).resize((128,128),Image.NEAREST);im.paste(z,(x0+40,y+190),z)
    z=tiny.resize((32,32),Image.LANCZOS).resize((128,128),Image.NEAREST);im.paste(z,(x0+180,y+190),z)
    d.text((x0+40,y+325),'16px (8x)',fill=fg,font=f);d.text((x0+180,y+325),'32px (4x)',fill=fg,font=f)
    m=mask.resize((150,150),Image.LANCZOS);mk=Image.new('L',(150,150),0);ImageDraw.Draw(mk).ellipse([0,0,149,149],fill=255);im.paste(m,(x0+340,y+190),mk)
    d.text((x0+340,y+325),'maskable (circle)',fill=fg,font=f)
    t=mac.resize((150,150),Image.LANCZOS);im.paste(t,(x0+540,y+190),t);d.text((x0+540,y+325),'macOS',fill=fg,font=f)
im.save('/workspace/icon_preview_B.png');print(im.size)
