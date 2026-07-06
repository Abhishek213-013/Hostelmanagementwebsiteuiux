export function cropImageToAspectRatio(file, targetRatio) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)

      const imgRatio = img.width / img.height
      const tolerance = 0.02

      if (Math.abs(imgRatio - targetRatio) < tolerance) {
        resolve(file)
        return
      }

      let sourceX, sourceY, sourceW, sourceH

      if (imgRatio > targetRatio) {
        sourceH = img.height
        sourceW = Math.round(img.height * targetRatio)
        sourceX = Math.round((img.width - sourceW) / 2)
        sourceY = 0
      } else {
        sourceW = img.width
        sourceH = Math.round(img.width / targetRatio)
        sourceX = 0
        sourceY = Math.round((img.height - sourceH) / 2)
      }

      const canvas = document.createElement('canvas')
      canvas.width = sourceW
      canvas.height = sourceH
      const ctx = canvas.getContext('2d')

      ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH)

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create cropped image'))
          return
        }
        const croppedFile = new File([blob], file.name, {
          type: file.type || 'image/jpeg',
          lastModified: Date.now()
        })
        resolve(croppedFile)
      }, file.type || 'image/jpeg', 0.95)
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('Failed to load image'))
    }
    img.src = URL.createObjectURL(file)
  })
}
