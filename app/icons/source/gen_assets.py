import os,struct,io,shutil
from PIL import Image
W='/workspace/iconwork2/B_';T='/workspace/tinywins/';D='/workspace/desktop/build/';A='/workspace/android-build/app/res/'
L=lambda n:Image.open(W+n+'-1024.png').convert('RGBA')
any_,small,tiny,full,mask,fg,mac,mono=[L(n) for n in ['any','small','tiny','full','maskable','fg','mac','mono']]
pick=lambda n: tiny if n<=32 else small if n<=48 else any_
def rs(im,n): return im.resize((n,n),Image.LANCZOS)
def save(im,p):
    os.makedirs(os.path.dirname(p),exist_ok=True); im.save(p,optimize=True)
def pngbytes(im):
    b=io.BytesIO();im.save(b,'PNG',optimize=True);return b.getvalue()
# --- web
os.makedirs(T+'icons',exist_ok=True)
for n in (16,32,48): save(rs(pick(n),n),T+f'icons/icon-{n}.png')
for n in (64,128,192,256,512,1024): save(rs(any_,n),T+f'icons/icon-{n}.png')
save(rs(full,180),T+'icons/apple-touch-icon-180.png')
save(rs(mask,512),T+'icons/icon-maskable-512.png'); save(rs(mask,192),T+'icons/icon-maskable-192.png')
# root files referenced by manifest/html/sw
save(rs(any_,192),T+'icon-192.png'); save(rs(any_,512),T+'icon-512.png')
save(rs(mask,192),T+'icon-maskable-192.png'); save(rs(mask,512),T+'icon-maskable-512.png')
save(rs(full,180),T+'apple-touch-icon.png')
save(rs(tiny,32),T+'favicon-32.png'); save(rs(small,48),T+'favicon-48.png')
for k,n in (('any','icon'),('small','icon-small'),('tiny','icon-tiny'),('maskable','icon-maskable'),('full','icon-apple'),('fg','icon-foreground'),('mac','icon-mac'),('mono','icon-monochrome')):
    shutil.copy(W+k+'.svg',T+f'icons/{n}.svg')
shutil.copy(W+'any.svg',T+'icon.svg'); shutil.copy(W+'tiny.svg',T+'favicon.svg')
# --- ICO writer (PNG-compressed entries)
def ico(images,path):
    ents=[];data=b''
    off=6+16*len(images)
    for im in images:
        b=pngbytes(im);w,h=im.size
        ents.append(struct.pack('<BBBBHHII',0 if w>=256 else w,0 if h>=256 else h,0,0,1,32,len(b),off+len(data)));data+=b
    open(path,'wb').write(struct.pack('<HHH',0,1,len(images))+b''.join(ents)+data)
src_for=pick
ico([rs(src_for(n),n) for n in (16,32,48)],T+'favicon.ico')
ico([rs(src_for(n),n) for n in (16,24,32,48,64,128,256)],D+'icon.ico')
shutil.copy(D+'icon.ico',T+'icons/tinywins.ico')
# --- ICNS writer (PNG payloads; macOS 10.7+ types)
def icns(path):
    types=[(b'icp4',16),(b'icp5',32),(b'icp6',64),(b'ic07',128),(b'ic08',256),(b'ic09',512),(b'ic10',1024),(b'ic11',32),(b'ic12',64),(b'ic13',256),(b'ic14',512)]
    body=b''
    for t,n in types:
        b=pngbytes(rs(mac,n));body+=t+struct.pack('>I',8+len(b))+b
    open(path,'wb').write(b'icns'+struct.pack('>I',8+len(body))+body)
icns(D+'icon.icns'); shutil.copy(D+'icon.icns',T+'icons/tinywins.icns')
# --- desktop png (Linux/electron-builder wants >=512; rounded, transparent)
save(any_,D+'icon.png'); save(mac,D+'icon-mac-1024.png')
# --- android
for d,n in (('mdpi',48),('hdpi',72),('xhdpi',96),('xxhdpi',144),('xxxhdpi',192)):
    save(rs(pick(n),n),A+f'mipmap-{d}/ic_launcher.png')
    save(rs(small if n<=72 else any_,n),A+f'mipmap-{d}/ic_launcher_round.png') if False else None
save(rs(fg,432),A+'drawable-xxxhdpi/ic_foreground.png')
save(rs(mono,432),A+'drawable-xxxhdpi/ic_monochrome.png')
save(rs(any_,512),'/workspace/android-build/play-store-icon-512.png')
print('ok')
