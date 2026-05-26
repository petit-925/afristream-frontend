
import React, { useState, useMemo } from 'react';

export default function ProductGallery({ images = [], variants = [] }: any) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const displayedImage = useMemo(() => images[selectedImageIdx] || images[0] || null, [images, selectedImageIdx]);
  return (
    <div className="product-gallery">
      <div className="main-image">
        {displayedImage ? <img src={displayedImage.url} alt="" className="max-h-96 object-contain" /> : <div className="h-64 bg-gray-100" />}
      </div>
      <div className="thumbnails flex gap-2 mt-2">
        {images.map((img:any, idx:number)=>(
          <img key={img.id||idx} src={img.thumbnail||img.url} className={`w-20 h-20 object-cover cursor-pointer ${selectedImageIdx===idx?'ring-2 ring-blue-500':''}`} onClick={()=>setSelectedImageIdx(idx)} />
        ))}
      </div>
    </div>
  );
}
