export default function scrollToTop () {
  const interval = setInterval(() => {
    if (window.pageYOffset <= 0) return clearInterval(interval)
    window.scrollTo(0, window.pageYOffset - 75)
  }, 1)
}
