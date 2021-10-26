window.onload = () => {
  document.querySelector('input[type=file]').addEventListener('change', (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = function(e) {
      document.querySelector('.img-preview__img').setAttribute('src', e.target.result)
    }
    reader.readAsDataURL(file)
  })
}