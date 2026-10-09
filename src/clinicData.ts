export type Unit = 'centro' | 'rio-maina'

export const units = {
  centro: { name: 'Centro', area: 'Criciúma · SC', phone: '5548998088800', displayPhone: '(48) 99808-8800', map: 'https://g.co/kgs/higUfCP' },
  'rio-maina': { name: 'Rio Maina', area: 'Criciúma · SC', phone: '5548988616963', displayPhone: '(48) 98861-6963', map: 'https://g.co/kgs/D9gZAJf' },
} as const

export const professionals = [
  { name: 'Dra. Aline Figueiredo', area: 'Implantes e próteses dentárias', detail: 'Também divulga atuação em harmonização facial.', post: 'https://www.instagram.com/p/DeHXej4pHb3/' },
  { name: 'Dra. Etyele Amaral', area: 'Endodontia', detail: '', post: 'https://www.instagram.com/p/Dd6akrVJjjP/' },
  { name: 'Dra. Letícia Soethe', area: 'Ortodontia', detail: '', post: 'https://www.instagram.com/p/Dd1nl6DpJgO/' },
  { name: 'Dra. Ana Vitória Savi', area: 'Odontologia clínica', detail: '', post: 'https://www.instagram.com/p/DdtWuaVpRAz/' },
]

export function whatsappUrl(unit: Unit) {
  const message = `Olá! Gostaria de informações sobre implantes e próteses e de solicitar uma avaliação na unidade ${units[unit].name}.`
  return `https://wa.me/${units[unit].phone}?text=${encodeURIComponent(message)}`
}
