import subprocess,sys,os
from PIL import Image
def render(svgfile,out,size=1024):
    html=f'/tmp/r_{os.path.basename(svgfile)}.html'
    open(html,'w').write(f'<html><body style="margin:0;background:transparent"><img src="file://{svgfile}" style="display:block;width:{size}px;height:{size}px"></body></html>')
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--default-background-color=00000000',f'--window-size={size},{size+200}',f'--screenshot={out}','--user-data-dir=/tmp/chr-icon',f'file://{html}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,timeout=60)
    im=Image.open(out).convert('RGBA'); im=im.crop((0,0,size,size)); im.save(out); return im
if __name__=='__main__':
    for k in ['any','small','full','maskable','fg','mac','mono']:
        im=render(f'/workspace/iconwork2/{k}.svg',f'/workspace/iconwork2/{k}-1024.png');print(k,im.size,im.getpixel((2,2)),im.getpixel((512,512)))
