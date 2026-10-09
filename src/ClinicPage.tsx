import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight, Check, MapPin, Menu, MessageCircle, X } from 'lucide-react'
import { professionals, units, whatsappUrl, type Unit } from './clinicData'
import './ClinicPage.css'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`

const ease = [0.22, 1, 0.36, 1] as const

function UnitPicker({ selected, onSelect }: { selected: Unit | null; onSelect: (unit: Unit) => void }) {
  const id = useId()
  const reduce = useReducedMotion()
  return (
    <div className="unit-picker">
      <span id={id} className="unit-picker__label">Onde você prefere conversar?</span>
      <div className="unit-picker__row">
        <div className="unit-picker__options" role="group" aria-labelledby={id}>
          {(Object.keys(units) as Unit[]).map(key => (
            <motion.button type="button" className={`unit-choice ${selected === key ? 'is-selected' : ''}`} aria-pressed={selected === key} key={key} onClick={() => onSelect(key)} whileTap={reduce ? undefined : { scale: 0.96 }}>
              {selected === key && <motion.span className="unit-choice__surface" layoutId={`selection-${id}`} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 390, damping: 32 }} />}
              <span>{units[key].name}</span>{selected === key && <Check size={14} aria-hidden="true" />}
            </motion.button>
          ))}
        </div>
        {selected ? <motion.a className="action action--primary" href={whatsappUrl(selected)} target="_blank" rel="noreferrer" whileTap={reduce ? undefined : { scale: 0.97 }}><MessageCircle size={17} aria-hidden="true" /><span>Pedir avaliação</span><ArrowUpRight size={17} aria-hidden="true" /></motion.a> : <button className="action action--primary" disabled><MessageCircle size={17} aria-hidden="true" /><span>Escolha uma unidade</span><ArrowUpRight size={17} aria-hidden="true" /></button>}
      </div>
      <p className="unit-picker__hint" aria-live="polite">{selected ? `WhatsApp oficial · ${units[selected].name}` : 'Centro e Rio Maina · Criciúma'}</p>
    </div>
  )
}

function TreatmentExplorer() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const treatments = [
    { name: 'Implantes', title: 'Converse sobre as possibilidades.', copy: 'Converse com a equipe sobre a opção e tire dúvidas sobre o atendimento.', next: 'A indicação depende da análise individual feita pela equipe odontológica.' },
    { name: 'Próteses dentárias', title: 'Entenda o próximo passo.', copy: 'Entenda as possibilidades e como a avaliação pode orientar os próximos passos.', next: 'Cada história e cada necessidade são diferentes. A avaliação ajuda a compreender as alternativas para o seu caso.' },
  ]
  return (
    <div className="treatment-explorer">
      <div className="treatment-explorer__copy">
        <div className="treatment-tabs" role="tablist" aria-label="Informações sobre atendimentos">
          {treatments.map((item, index) => <button key={item.name} ref={el => { buttons.current[index] = el }} type="button" role="tab" id={`treatment-tab-${index}`} aria-controls="treatment-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)} onKeyDown={event => { let next = active; if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - active; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = 1; else return; event.preventDefault(); setActive(next); buttons.current[next]?.focus() }}>
            {active === index && <motion.span className="treatment-tabs__surface" layoutId="treatment-tab" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 330, damping: 32 }} />}<span>{item.name}</span>
          </button>)}
        </div>
        <div className="treatment-panel" role="tabpanel" id="treatment-panel" aria-labelledby={`treatment-tab-${active}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: reduce ? 'none' : 'blur(0px)' }} exit={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : -8 }} transition={{ duration: reduce ? 0 : 0.28, ease }}>
              <h3>{treatments[active].title}</h3><p>{treatments[active].copy}</p><p className="treatment-panel__note">{treatments[active].next}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <a className="text-link" href="#unidades">Encontrar minha unidade <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <figure className="treatment-explorer__image">
        <motion.img src={asset('implantes-detail.webp')} alt="Ilustração de prótese sobre implantes publicada pela Mais Odonto, identificada como conteúdo de IA; não representa paciente ou resultado clínico." width="1080" height="680" loading="lazy" decoding="async" animate={{ objectPosition: active === 0 ? '50% 80%' : '50% 35%', scale: active === 0 ? 1.08 : 1 }} transition={{ duration: reduce ? 0 : 0.8, ease }} />
        <figcaption>Ilustração da publicação oficial <span>Conteúdo de IA · não representa resultado clínico</span></figcaption>
      </figure>
    </div>
  )
}

function AssessmentSteps() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 45%'] })
  const progress = useTransform(scrollYProgress, [0, 0.8], reduce ? [1, 1] : [0, 1])
  return (
    <section className="assessment section-space" ref={ref} aria-labelledby="assessment-title">
      <div className="section-heading"><h2 id="assessment-title">Comece pelo<br />lugar certo.</h2><p>Você escolhe a unidade.<br />A equipe continua a conversa com você.</p></div>
      <div className="assessment__steps">
        <div className="assessment__track" aria-hidden="true"><motion.span style={{ scaleX: progress }} /></div>
        {[
          ['01', 'Escolha a unidade', 'Centro ou Rio Maina — ambas em Criciúma.'],
          ['02', 'Fale com a equipe', 'Conte, em linhas gerais, sobre o que gostaria de conversar.'],
          ['03', 'Peça sua avaliação', 'A equipe orienta sobre disponibilidade e próximos passos.'],
        ].map(([number, title, description]) => <article className="assessment-step" key={number}><span className="assessment-step__number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}
      </div>
    </section>
  )
}

export default function ClinicPage() {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [headerSolid, setHeaderSolid] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const heroVisible = useInView(heroRef, { amount: 0.15 })
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.95])
  const heroRadius = useTransform(scrollYProgress, [0, 0.8], reduce ? ['0px', '0px'] : ['0px', '36px'])
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 55])
  const pointer = useMotionValue(0)
  const photoX = useSpring(pointer, { stiffness: 85, damping: 30 })
  const closeMenu = useCallback(() => { if (!menuOpen) return; setMenuOpen(false); toggleRef.current?.focus() }, [menuOpen])

  useEffect(() => {
    const onScroll = () => { setHeaderSolid(window.scrollY > 32); if (window.scrollY < (heroRef.current?.offsetHeight ?? 0) - 150) setActiveSection('') }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id) }) }, { rootMargin: '-20% 0px -55% 0px' })
    document.querySelectorAll('#tratamentos, #equipe, #unidades').forEach(section => observer.observe(section))
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect() }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeMenu(); return }
      if (event.key !== 'Tab') return
      const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]')
      if (!links?.length) return
      const first = links[0], last = links[links.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    const onResize = () => { if (window.innerWidth > 820) setMenuOpen(false) }
    document.addEventListener('keydown', onKey); window.addEventListener('resize', onResize)
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize) }
  }, [menuOpen, closeMenu])

  return (
    <div className="clinic-page">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className={`site-header ${headerSolid || menuOpen ? 'is-solid' : ''}`}>
        <a className="brand" href="#inicio" aria-label="Mais Odonto Clínica — início"><strong>mais<span>ODONTO</span></strong><small>Clínica</small></a>
        <button className="menu-toggle" ref={toggleRef} type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} id="main-nav" aria-label="Navegação principal" ref={menuRef}>
          {[['tratamentos', 'Implantes e próteses'], ['equipe', 'Equipe'], ['unidades', 'Unidades']].map(([id, label]) => <a href={`#${id}`} key={id} onClick={closeMenu} aria-current={activeSection === id ? 'location' : undefined}>{label}{activeSection === id && <motion.span className="nav-active" layoutId="nav-active" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 30 }} />}</a>)}
          <a href="#unidades" className="nav-cta" onClick={closeMenu}>Agendar avaliação <ArrowUpRight size={15} aria-hidden="true" /></a>
        </nav>
      </header>

      <main id="conteudo">
        <section className="hero" id="inicio" ref={heroRef} onPointerMove={event => { if (!reduce && event.pointerType === 'mouse' && window.innerWidth > 820) pointer.set((event.clientX / window.innerWidth - 0.5) * -12) }} onPointerLeave={() => pointer.set(0)}>
          <motion.div className="hero__scene" style={{ scale: heroScale, borderRadius: heroRadius }}>
            <motion.img className="hero__photo" src={asset('atendimento-ia-1536.webp')} srcSet={`${asset('atendimento-ia-720.webp')} 720w, ${asset('atendimento-ia-1080.webp')} 1080w, ${asset('atendimento-ia-1536.webp')} 1536w`} sizes="100vw" width="1536" height="1024" fetchPriority="high" decoding="async" alt="Atendimento da Dra. Aline Figueiredo, em fotografia do perfil oficial com tratamento de qualidade por IA." style={{ x: reduce ? 0 : photoX, y: photoY }} initial={reduce ? false : { scale: 1.07 }} animate={{ scale: 1.025 }} transition={{ duration: 1.6, ease }} />
            <div className="hero__shade" />
          </motion.div>
          <div className="hero__content">
            <motion.div className="hero__copy" initial={reduce ? false : { y: 24, filter: 'blur(4px)', opacity: 0.8 }} animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }} transition={{ duration: 1.05, ease }}>
              <h1>Implantes<br />e próteses.</h1>
              <p>Conheça a equipe, tire dúvidas e peça uma avaliação na unidade que preferir.</p>
            </motion.div>
            <motion.div className="hero__contact" initial={reduce ? false : { y: 15, opacity: 0.7 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.12, ease }}><UnitPicker selected={selectedUnit} onSelect={setSelectedUnit} /></motion.div>
          </div>
          <div className="hero__foot"><span>Mais Odonto Clínica · Criciúma</span><a href="#tratamentos" aria-label="Conhecer implantes e próteses"><ArrowDown size={18} aria-hidden="true" /> Continue explorando</a><a href="https://www.instagram.com/p/DDppKmYSj4J/" target="_blank" rel="noreferrer">Foto oficial · tratada com IA <ArrowUpRight size={12} aria-hidden="true" /></a></div>
        </section>

        <section className="treatments section-space" id="tratamentos" aria-labelledby="treatments-title">
          <div className="section-heading"><h2 id="treatments-title">Entender primeiro.<br />Avaliar com cuidado.</h2><p>A avaliação é o momento de conversar sobre sua saúde bucal, esclarecer dúvidas e entender quais alternativas podem ser consideradas.</p></div>
          <TreatmentExplorer />
          <p className="clinical-note">Conteúdo informativo. A avaliação profissional é necessária para definir indicação e conduta.</p>
        </section>

        <section className="team-section section-space" id="equipe" aria-labelledby="team-title">
          <div className="section-heading"><h2 id="team-title">Uma equipe.<br />Olhares diferentes.</h2><p>Profissionais de diferentes áreas da odontologia. Para implantes e próteses, conheça a atuação da Dra. Aline Figueiredo.</p></div>
          <div className="team-roster">
            {professionals.map((person, index) => <motion.a className={`team-person ${index === 0 ? 'team-person--featured' : ''}`} key={person.name} href={person.post} target="_blank" rel="noreferrer" initial={false} whileHover={reduce ? undefined : { backgroundColor: 'rgba(255,255,255,0.035)' }} transition={{ duration: 0.25 }}><span className="team-person__area">{person.area}</span><div><h3>{person.name}</h3>{person.detail && <p>{person.detail}</p>}</div><span className="team-person__link">Conheça no Instagram <ArrowUpRight size={19} aria-hidden="true" /></span></motion.a>)}
          </div>
        </section>

        <AssessmentSteps />

        <section className="units-section section-space" id="unidades" aria-labelledby="units-title">
          <div className="section-heading"><h2 id="units-title">Escolha por<br />onde começar.</h2><p>Selecione a unidade para abrir uma conversa no canal oficial. Se preferir, consulte a localização pelo link da clínica.</p></div>
          <div className="unit-panels">
            {(Object.keys(units) as Unit[]).map(key => <article className={`unit-panel ${selectedUnit === key ? 'is-selected' : ''}`} key={key}>
              {selectedUnit === key && <motion.div className="unit-panel__selected" layoutId="selected-unit-panel" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }} />}
              <button className="unit-panel__select" type="button" onClick={() => setSelectedUnit(key)} aria-pressed={selectedUnit === key}><span className="unit-panel__city"><MapPin size={15} aria-hidden="true" />{units[key].area}</span><h3>{units[key].name}</h3><span className="unit-panel__status">{selectedUnit === key ? <><Check size={16} /> Unidade selecionada</> : <>Escolher esta unidade <ArrowUpRight size={16} /></>}</span></button>
              <div className="unit-panel__links"><a href={units[key].map} target="_blank" rel="noreferrer">Ver localização <ArrowUpRight size={15} aria-hidden="true" /></a><a href={whatsappUrl(key)} target="_blank" rel="noreferrer"><MessageCircle size={15} aria-hidden="true" />{units[key].displayPhone}</a></div>
            </article>)}
          </div>
          <div className="units-confirmation" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.p key={selectedUnit ?? 'none'} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduce ? 1 : 0 }} transition={{ duration: 0.2 }}>{selectedUnit ? `Sua conversa começa na unidade ${units[selectedUnit].name}.` : 'Duas unidades em Criciúma. Escolha a que faz sentido para você.'}</motion.p></AnimatePresence>{selectedUnit && <a className="action action--primary" href={whatsappUrl(selectedUnit)} target="_blank" rel="noreferrer">Pedir minha avaliação <ArrowUpRight size={17} aria-hidden="true" /></a>}</div>
        </section>
      </main>

      <footer className="site-footer"><div className="site-footer__top"><a className="brand" href="#inicio" aria-label="Mais Odonto Clínica — início"><strong>mais<span>ODONTO</span></strong><small>Clínica</small></a><p>Ver você sorrir é a nossa<br />maior felicidade.</p><a className="text-link" href="https://www.instagram.com/maisodonto_clinica/" target="_blank" rel="noreferrer">Instagram oficial <ArrowUpRight size={17} aria-hidden="true" /></a></div><div className="site-footer__bottom"><span>Mais Odonto Clínica · Criciúma / SC</span><span>Informação inicial. Não substitui uma avaliação odontológica.</span><a href="#inicio">Voltar ao início <ArrowUpRight size={14} aria-hidden="true" /></a></div></footer>
      <AnimatePresence>{!heroVisible && !menuOpen && <motion.div className="mobile-contact" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : 20 }} transition={{ duration: 0.3, ease }}><span>{selectedUnit ? units[selectedUnit].name : 'Mais Odonto Clínica'}</span><a href={selectedUnit ? whatsappUrl(selectedUnit) : '#unidades'} target={selectedUnit ? '_blank' : undefined} rel="noreferrer">{selectedUnit ? 'Pedir avaliação' : 'Escolher unidade'} <ArrowUpRight size={16} aria-hidden="true" /></a></motion.div>}</AnimatePresence>
    </div>
  )
}
