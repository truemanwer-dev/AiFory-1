import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  ShieldCheck,
  Clock,
  User,
  ChatCircle,
  MapPin,
  ArrowsLeftRight,
  Lock,
  PaperPlaneTilt,
  Sparkle,
  Globe,
  TrendUp,
} from '@phosphor-icons/react';

const TG_URL = "https://t.me/+ZHeRkICBUr02MDhk";

const FAQ_ITEMS = [
  { q: "Как происходит обмен?", a: "Вы пишете нам в Telegram, согласовываем курс, сумму и время встречи. Далее встречаемся лично и проводим обмен на месте." },
  { q: "Какие валюты вы обмениваете?", a: "USDT, BTC, ETH на наличные и обратно. Полный список направлений уточняйте у менеджера." },
  { q: "Нужна ли верификация личности?", a: "Нет. Мы не требуем документы и не запрашиваем личные данные. Все сделки конфиденциальны." },
  { q: "Какой минимальный объём сделки?", a: "Минимальная сумма зависит от направления обмена. Актуальные условия уточняйте в Telegram." },
  { q: "Вы работаете круглосуточно?", a: "Служба поддержки на связи 24/7. Обмен производится по предварительной записи ежедневно." },
  { q: "Где вы работаете?", a: "Мы работаем по всей России. Конкретные города и адреса уточняйте у менеджера — подберём ближайший к вам пункт обмена." },
  { q: "Как быстро проходит сделка?", a: "В среднем 10–15 минут с момента встречи. Точное время зависит от суммы и сети." },
  { q: "Есть ли ограничения по сумме?", a: "Минимум от 100 USDT, максимум обсуждается индивидуально. Крупные суммы — по предварительной договорённости." },
];

const CITIES = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург",
  "Казань", "Нижний Новгород", "Краснодар", "Ростов-на-Дону",
  "Самара", "Уфа", "Воронеж", "Сочи"
];

function TelegramGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.5 3.5L2.5 11l5.5 2 2 6 3-3.5 5 4 3.5-16zM10 14l8-7-10 6.5z" />
    </svg>
  );
}

function TgButton({ children, size = "md" }) {
  const sizeClass = size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : "btn-md";
  return (
    <a href={TG_URL} target="_blank" rel="noopener noreferrer" className={`tg-btn ${sizeClass}`}>
      <TelegramGlyph className="tg-glyph" />
      {children}
    </a>
  );
}

function FloatingCoins() {
  const coins = [
    { ch: '₿', cls: 'c1', left: '4%', top: '12%' },
    { ch: 'Ξ', cls: 'c2', left: '12%', top: '30%' },
    { ch: '₮', cls: 'c3', left: '8%', top: '55%' },
    { ch: '◎', cls: 'c4', left: '15%', top: '75%' },
    { ch: '◈', cls: 'c5', left: '3%', top: '88%' },
    { ch: '₿', cls: 'c2', left: '90%', top: '10%' },
    { ch: 'Ξ', cls: 'c3', left: '94%', top: '28%' },
    { ch: '₮', cls: 'c1', left: '88%', top: '50%' },
    { ch: '◎', cls: 'c5', left: '95%', top: '70%' },
    { ch: '◈', cls: 'c4', left: '92%', top: '88%' },
  ];
  return (
    <div className="floating-coins" aria-hidden>
      {coins.map((c, i) => (
        <span key={i} className={`coin ${c.cls}`} style={{ left: c.left, top: c.top }}>{c.ch}</span>
      ))}
    </div>
  );
}

function AnimatedCounter({ target, suffix = '' }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const duration = 1500;
        const begin = performance.now();
        const step = (now) => {
          const p = Math.min((now - begin) / duration, 1);
          setValue(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(step);
          else setValue(target);
        };
        requestAnimationFrame(step);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{value}{suffix}</span>;
}

function Reveal({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="reveal">{children}</div>;
}

function FeatureCard({ icon, title, desc, metric }) {
  return (
    <div className="feature-card">
      {metric && <span className="feature-metric">{metric}</span>}
      <div className="feature-icon-wrap">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function StepCard({ num, icon, title, desc }) {
  return (
    <div className="step-card">
      <span className="step-bg-num">{String(num).padStart(2, '0')}</span>
      <div className="step-icon-wrap">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function FaqRow({ item, idx, isOpen, onToggle }) {
  return (
    <div className={`faq-row ${isOpen ? 'is-open' : ''}`}>
      <button className="faq-btn" onClick={onToggle}>
        <span className="faq-left">
          <span className="faq-index">{String(idx + 1).padStart(2, '0')}</span>
          <span className="faq-q">{item.q}</span>
        </span>
        <span className="faq-toggle">+</span>
      </button>
      <div className="faq-panel">
        <p className="faq-a">{item.a}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [openFaq, setOpenFaq] = useState(0);
  const [onlineManagers] = useState(3);
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="app">
      <div className="backdrop" />
      <div className="corner-glow corner-tl" />
      <div className="corner-glow corner-br" />
      <FloatingCoins />

      <header className="site-header">
        <div className="header-wrap">
          <div className="brand-wrap">
            <img src="/logo.png" alt="Aifory Pro" className="brand-logo" />
          </div>
          <TgButton size="sm">Написать в Telegram</TgButton>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-left">
                <div className="hero-tag">
                  <Sparkle size={16} weight="fill" />
                  <span>Премиальный обменный сервис</span>
                </div>
                <h1 className="hero-h1">
                  Обмен криптовалют
                  <span className="h1-accent"> на лучших условиях</span>
                </h1>
                <p className="hero-lead">
                  Надёжный и быстрый обмен криптовалют. Выгодные курсы, минимальные комиссии и полная безопасность сделки.
                </p>

                <div className="crypto-row">
                  <span className="crypto-chip">₿ BTC</span>
                  <span className="crypto-chip">Ξ ETH</span>
                  <span className="crypto-chip">₮ USDT</span>
                </div>

                <div className="hero-actions">
                  <TgButton size="lg">Написать в Telegram</TgButton>
                  <div className="hero-note">
                    <ShieldCheck size={18} weight="duotone" className="note-icon" />
                    <span>Уже 15 000+ клиентов доверили нам обмен</span>
                  </div>
                </div>

                <div className="hero-trust">
                  <div className="trust-item">
                    <ShieldCheck size={22} weight="duotone" className="trust-icon" />
                    <span>Безопасно</span>
                  </div>
                  <div className="trust-item">
                    <Clock size={22} weight="duotone" className="trust-icon" />
                    <span>Быстро</span>
                  </div>
                  <div className="trust-item">
                    <Lock size={22} weight="duotone" className="trust-icon" />
                    <span>Конфиденциально</span>
                  </div>
                </div>
              </div>

              <div className="hero-right">
                <div className="hero-emblem-wrap">
                  <div className="emblem-glow" />
                  <div className="emblem-ring ring-1" />
                  <div className="emblem-ring ring-2" />
                  <div className="emblem-ring ring-3" />
                  <img src="/logo.png" alt="Aifory Pro" className="hero-emblem" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-block">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-cell">
                <div className="stat-value"><AnimatedCounter target={10} suffix="+" /></div>
                <div className="stat-label">Лет на рынке</div>
              </div>
              <div className="stat-cell">
                <div className="stat-value"><AnimatedCounter target={25} suffix="K+" /></div>
                <div className="stat-label">Успешных сделок</div>
              </div>
              <div className="stat-cell">
                <div className="stat-value"><AnimatedCounter target={15} suffix="K+" /></div>
                <div className="stat-label">Клиентов</div>
              </div>
              <div className="stat-cell">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Поддержка</div>
              </div>
            </div>
          </div>
        </section>

        <Reveal>
          <section className="features-block">
            <div className="container">
              <div className="section-head">
                <span className="section-tag">ПОЧЕМУ МЫ</span>
                <h2 className="section-h2">Преимущества Aifory Pro</h2>
                <p className="section-desc">Каждая сделка проходит под личным контролем менеджера — от согласования курса до передачи средств.</p>
              </div>
              <div className="features-grid">
                <FeatureCard
                  metric="0%"
                  icon={<ShieldCheck size={28} weight="duotone" />}
                  title="Только личная встреча"
                  desc="Полная защита сделки. Никаких предоплат и переводов заранее."
                />
                <FeatureCard
                  metric="10 мин"
                  icon={<Clock size={28} weight="duotone" />}
                  title="Быстрая сделка"
                  desc="Обмен занимает минимум времени. Работаем по записи."
                />
                <FeatureCard
                  metric="ТОП"
                  icon={<TrendUp size={28} weight="duotone" />}
                  title="Лучший курс"
                  desc="Актуальные котировки без скрытых наценок и комиссий."
                />
                <FeatureCard
                  metric="24/7"
                  icon={<ChatCircle size={28} weight="duotone" />}
                  title="Поддержка на связи"
                  desc="Отвечаем в Telegram в течение пары минут в любое время."
                />
                <FeatureCard
                  metric="Вся РФ"
                  icon={<Globe size={28} weight="duotone" />}
                  title="Работаем по России"
                  desc="Офисы в десятках городов. Точку встречи выбираете вы."
                />
                <FeatureCard
                  metric="1:1"
                  icon={<User size={28} weight="duotone" />}
                  title="Личный менеджер"
                  desc="Индивидуальный подход к сумме, курсу и времени."
                />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="steps-block">
            <div className="container">
              <div className="section-head">
                <span className="section-tag">КАК ЭТО РАБОТАЕТ</span>
                <h2 className="section-h2">Четыре шага до сделки</h2>
                <p className="section-desc">Простой процесс без регистрации, верификации и скрытых условий.</p>
              </div>
              <div className="steps-grid">
                <StepCard num={1} icon={<ChatCircle size={26} weight="duotone" />} title="Связь" desc="Напишите в Telegram и укажите детали обмена" />
                <StepCard num={2} icon={<Clock size={26} weight="duotone" />} title="Согласование" desc="Фиксируем курс, сумму и время встречи" />
                <StepCard num={3} icon={<MapPin size={26} weight="duotone" />} title="Встреча" desc="Приезжаете в офис в удобное время" />
                <StepCard num={4} icon={<ArrowsLeftRight size={26} weight="duotone" />} title="Обмен" desc="Получаете средства сразу после сделки" />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="cities-block">
            <div className="container">
              <div className="section-head">
                <span className="section-tag">ГЕОГРАФИЯ</span>
                <h2 className="section-h2">Работаем по всей России</h2>
                <p className="section-desc">Офисы в крупнейших городах страны. Если вашего города нет в списке — напишите нам, подберём ближайший пункт обмена.</p>
              </div>
              <div className="cities-grid">
                {CITIES.map((city) => (
                  <div className="city-chip" key={city}>
                    <MapPin size={18} weight="duotone" className="city-icon" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>
              <p className="cities-note">
                Пункты обмена в вашем городе уточняйте у менеджера в Telegram
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="faq-block" id="faq">
            <div className="container">
              <div className="section-head">
                <span className="section-tag">ВОПРОСЫ И ОТВЕТЫ</span>
                <h2 className="section-h2">Часто задаваемые вопросы</h2>
                <p className="section-desc">Если не нашли ответ — напишите нам в Telegram, ответим за пару минут.</p>
              </div>
              <div className="faq-list">
                {FAQ_ITEMS.map((item, i) => (
                  <FaqRow key={i} item={item} idx={i} isOpen={openFaq === i} onToggle={() => toggleFaq(i)} />
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="cta-block">
            <div className="container">
              <div className="cta-box">
                <div className="cta-glow" />
                <div className="cta-left">
                  <div className="cta-icon-wrap">
                    <PaperPlaneTilt size={28} weight="fill" />
                  </div>
                  <div>
                    <h3>Готовы начать обмен?</h3>
                    <p>Напишите нам в Telegram и получите актуальный курс прямо сейчас</p>
                    <div className="cta-meta">
                      <span className="cta-live">
                        <span className="live-dot" />
                        На связи: {onlineManagers} менеджера
                      </span>
                      <span className="cta-time">· Среднее время ответа: 2 минуты</span>
                    </div>
                  </div>
                </div>
                <TgButton size="lg">Перейти в Telegram</TgButton>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <img src="/logo.png" alt="Aifory Pro" className="footer-logo" />
            </div>
            <p className="footer-text">Премиальный обмен криптовалют с личной встречей по всей России.</p>
          </div>
          <div className="footer-links">
            <a href={TG_URL}>Telegram</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-copy">© 2024 Aifory Pro</div>
        </div>
      </footer>
    </div>
  );
}