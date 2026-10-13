export const invitation = {
 theme: 'uzbek', bride: 'Dilnoza', groom: 'Javohir', date: '2026-11-21T18:00:00+05:00', timeZone: 'Asia/Tashkent',
 venue: { name: 'Versal Wedding Hall', address: 'Toshkent shahri', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Versal+Wedding+Hall+Tashkent' },
 // Optional theme-specific customization; existing fields remain compatible.
 themeOptions: {peel:{phrase:'Bir muhabbatdan boshlangan yo‘l — bir umrga ulanadi.',music:null}},
 // Temporary development preview only: zero digits are not a payment destination.
 giftCardsDemo: true,
 giftCards: [{holder:'SHAXZOD NAMUNA',number:'0000 0000 0000 0000',label:'Demo'}],
 heroImage: null, imagePosition: 'center', music: null, rsvpEndpoint: null,
 invitationText: 'Aziz mehmonimiz,\nhayotimizning eng unutilmas kunlaridan birida Sizni yonimizda ko‘rishni istaymiz.\nBiz bilan birga ushbu quvonchli oqshomni baham ko‘ring.',
 phrase: 'Ikki qalb. Bir taqdir.', schedule: [{time:'17:00',title:'Mehmonlarni kutib olish',text:'Siz bilan diydorlashish va samimiy suhbat.'},{time:'18:00',title:'Nikoh oqshomi',text:'Birgalikdagi yangi hayotimizning boshlanishi.'},{time:'19:00',title:'Bayram dasturi',text:'Musiqa, tabassum va unutilmas lahzalar.'}]
};
export const themes = {
 peel:{name:'Peel Envelope',hint:'Lentani oxirigacha o‘ngga torting',object:'peel',symbol:'✧',music:'assets/audio/royal.wav'},
 royal:{name:'Royal Wax Seal',hint:'Muhrga teging — hikoyamiz boshlansin',object:'seal',symbol:'✧',music:'assets/audio/royal.wav'},
 uzbek:{name:'Uzbek Heritage',hint:'Non markaziga teging — baxt eshiklari ochilsin',object:'bread',symbol:'❋',music:'assets/audio/uzbek.wav'},
 botanical:{name:'Botanical Garden',hint:'Gulga teging — muhabbat gullasin',object:'flower',symbol:'❧',music:'assets/audio/botanical.wav'},
 ribbon:{name:'Silk Ribbon',hint:'Lentaga teging — siz uchun tuhfa',object:'ribbon',symbol:'✧',music:'assets/audio/ribbon.wav'},
 samarkand:{name:'Samarkand Night',hint:'Naqshga teging — yulduzli oqshomga marhamat',object:'medallion',symbol:'✦',music:'assets/audio/samarkand.wav'},
 garden:{name:'Garden Gate',hint:'Tutqichga teging — bog‘imizga marhamat',object:'gate',symbol:'❧',music:'assets/audio/garden.wav'}
};
