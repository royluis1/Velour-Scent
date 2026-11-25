import { useState } from 'react';

export default function ProductImage({ image, name, fallbackStyle }) {
  const [failedImage, setFailedImage] = useState(null);
  if (!image || failedImage === image) {
    return <span className="mono" style={fallbackStyle}>{name?.[0] || 'V'}</span>;
  }
  return <img src={image} alt={name || ''} onError={() => setFailedImage(image)} />;
}
