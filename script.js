const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => revealObserver.observe(item));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroVisual = document.querySelector('.hero-visual');
const photoFrame = document.querySelector('.photo-frame');

if (heroVisual && photoFrame && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    photoFrame.style.setProperty('--photo-x', `${x}px`);
    photoFrame.style.setProperty('--photo-y', `${y}px`);
  });

  heroVisual.addEventListener('pointerleave', () => {
    photoFrame.style.setProperty('--photo-x', '0px');
    photoFrame.style.setProperty('--photo-y', '0px');
  });
}

const drawDeck = document.querySelector('[data-draw-deck]');
const drawButton = document.querySelector('[data-draw-button]');
const drawnCard = document.querySelector('[data-drawn-card]');

if (drawDeck && drawButton && drawnCard) {
  const cardIndex = drawnCard.querySelector('[data-card-index]');
  const cardType = drawnCard.querySelector('[data-card-type]');
  const cardTitle = drawnCard.querySelector('[data-card-title]');
  const cardDescription = drawnCard.querySelector('[data-card-description]');
  const cardTags = drawnCard.querySelector('[data-card-tags]');
  const cardImage = drawnCard.querySelector('[data-card-image]');
  const cardMedia = drawnCard.querySelector('[data-card-media]');
  const cardFoot = drawnCard.querySelector('[data-card-foot]');
  const cardOrder = [1, 0, 3, 5, 4, 2];
  let currentStep = 0;
  let currentCard = cardOrder[currentStep];

  const profileCards = [
    {
      type: 'HOBBY / PHOTOGRAPHY',
      title: '摄影',
      description: '我喜欢拿起相机记录城市、光线和人的情绪，也喜欢被拍，把自己放进别人镜头里的故事。',
      tags: ['观察力', '审美', '记录'],
      image: 'assets/hobby-photography-me.jpg',
      alt: '周乐天拿着相机的照片',
      foot: 'SHOOT / BE SHOT'
    },
    {
      type: 'LIFE / MOUNTAIN',
      title: '爬山',
      description: '今年的目标是爬完五岳，目前已经完成三座。一步一步走到山顶，也把沿途的风景和心情收进自己的地图里。',
      tags: ['五岳计划', '已完成 3 / 5', '在路上'],
      image: 'assets/hobby-mountain.jpg',
      alt: '周乐天在山野中的照片',
      foot: 'KEEP CLIMBING'
    },
    {
      type: 'SKILL / AI MAKER',
      title: 'AI 尝试',
      description: '我持续把 AI 用在有趣又具体的生活问题里，做过拼豆图纸智能生成系统和 SmartCloset AI 智能衣橱。',
      tags: ['多模态', '从 0 到 1', '做中学'],
      image: 'assets/project-smart-closet.jpg',
      alt: 'SmartCloset AI 智能衣橱界面',
      foot: 'BUILD / LEARN / SHARE'
    },
    {
      type: 'LIFE / GAME',
      title: '玩游戏',
      description: '我喜欢在《星露谷物语》和开罗游戏里慢慢经营一个小世界，享受规划、收集和一点点把日常过好的过程。',
      tags: ['星露谷物语', '开罗游戏', '经营感'],
      image: 'assets/hobby-gaming.jpg',
      alt: '星露谷物语冬日农场截图',
      foot: 'PLAY / BUILD / REPEAT'
    },
    {
      type: 'LIFE / SUDOKU',
      title: '数独',
      description: '我也喜欢数独，在有限的信息里寻找规律，把一个个小线索拼成完整答案。',
      tags: ['专注力', '逻辑感', '耐心'],
      image: null,
      alt: '',
      foot: 'FIND THE PATTERN'
    },
    {
      type: 'LIFE / COMEDY',
      title: '听脱口秀',
      description: '我喜欢听脱口秀，在笑点里放松一下，也从不同人的表达里发现生活中那些有趣又真实的角度。',
      tags: ['幽默感', '松弛感', '换个角度'],
      image: 'assets/hobby-comedy.jpg',
      alt: '脱口秀现场舞台照片',
      foot: 'LAUGH / OBSERVE / REFRAME'
    }
  ];

  const renderCard = (card, index) => {
    cardIndex.textContent = `PROFILE CARD / ${String(index + 1).padStart(2, '0')}`;
    cardType.textContent = card.type;
    cardTitle.textContent = card.title;
    cardDescription.textContent = card.description;
    cardTags.innerHTML = card.tags.map((tag) => `<span>${tag}</span>`).join('');
    cardFoot.textContent = card.foot;
    if (card.image) {
      drawnCard.classList.remove('is-text-card');
      cardMedia.hidden = false;
      cardImage.src = card.image;
      cardImage.alt = card.alt;
    } else {
      drawnCard.classList.add('is-text-card');
      cardMedia.hidden = true;
    }
  };

  drawButton.addEventListener('click', () => {
    currentStep = (currentStep + 1) % cardOrder.length;
    currentCard = cardOrder[currentStep];
    if (prefersReducedMotion) {
      renderCard(profileCards[currentCard], currentCard);
      return;
    }
    drawnCard.classList.add('is-drawing');
    window.setTimeout(() => {
      renderCard(profileCards[currentCard], currentCard);
      drawnCard.classList.remove('is-drawing');
    }, 260);
  });
}
