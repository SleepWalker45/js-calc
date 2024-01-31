// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  static #list = [];

  constructor (name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name;
    this.author = author;
    this.image = image;
  }

  static create(name, author, image) {
      const newTrack = new Track(name, author, image);
      this.#list.push(newTrack);
      return newTrack
  }

  static getList() {
    return this.#list.reverse();
  }

  static getById (id) {
    return this.#list.find((track) => track.id === id)
  }
}

Track.create (
  'Инь и Янь',
  'Monatik and Roxolana',
  'https://picsum.photos/100/100',
)

Track.create (
  'Baila Conmigo (Remix)',
  'Selena Gomez & Rauf Alejandro',
  'https://picsum.photos/100/100',
)

Track.create (
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/100/100',
)

Track.create (
  'Dakiti',
  'Bad Bunny & Jhey',
  'https://picsum.photos/100/100',
)

Track.create (
  '11 PM',
  'Maluma',
  'https://picsum.photos/100/100',
)

Track.create (
  'Другая любовь',
  'Enleo',
  'https://picsum.photos/100/100',
)

class Playlist {
  static #list = [];

  constructor (name) {
    this.id = Math.floor(1000 + Math.random() * 9000);
    this.name = name;
    this.tracks = [];
  }

  static create(name) {
    const newPlaylist = new Playlist(name);
    this.#list.push(newPlaylist);
    return newPlaylist
  }

  static getList () {
    return this.#list.reverse()
  }

  static makeMix (playlist) {
    const allTracks = Track.getList();

    let randomTracks = allTracks
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById (id) {
    return (
      Playlist.#list.find((playlist) => playlist.id === id) || null
    )
  }

  deleteTrackById (trackId) {
    this.tracks = this.tracks.filter((track) => track.id !== trackId)
  }

  static trackAdd (playlistId, trackId) {
    const playlist = Playlist.getById(playlistId);
    const track = Track.getById(trackId);
    return playlist.tracks.push(track);
  }

  static searchByWord (wordToSearch) {
    const playlistAll = Playlist.getList();
    return playlistAll.filter(playlist => playlist.name.toLowerCase().includes(wordToSearch.toLowerCase()))
  }
}

Playlist.makeMix(Playlist.create('Музыка в машину'));
Playlist.makeMix(Playlist.create('Музыка для расслабона'));
Playlist.makeMix(Playlist.create('Музыка на тренировку'));
Playlist.makeMix(Playlist.create('Музыка спокойная'));
Playlist.makeMix(Playlist.create('Музыка спокойная'));

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-main', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-main',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/spotify-main', function (req, res) {
  const playList = Playlist.getList()


  res.render('spotify-main', {
    style: 'spotify-main',
    data: {
      playList
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/spotify-search', function (req, res) {
  const playList = Playlist.getList()


  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      playList
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/spotify-search', function (req, res) {
  const {wordToSearch} = req.body;
  console.log('Консоль на поиск сработала')
  console.log(wordToSearch)

  const playList = Playlist.searchByWord(wordToSearch);
  console.log(playList)




  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      playList
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/spotify-choose', function (req, res) {


  res.render('spotify-choose', {
    style: 'spotify-choose',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/alert', function (req, res) {

  res.render('alert', {
    style: 'alert',
    data: {
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix;


  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix;
  const name = req.body.name;
  
  if (!name) {
    return res.render('alert', {
      style: 'alert',
      info: 'Название не указано',
      link: isMix? '/spotify-create?isMix=true' 
      : '/spotify-create',
    })
  }

  const playlist = Playlist.create(name);

  if (isMix) {
    Playlist.makeMix(playlist)
  }


  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id);
  const playlist = Playlist.getById(id);

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      info: 'Плейлист не найден',
      link: '/'
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId);
  const trackId = Number(req.query.trackId);

  const playlist = Playlist.getById(playlistId);

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      info: 'Плейлист не найден',
      link: `/spotify-playlist?id=${playlistId}`
    })
  }

  playlist.deleteTrackById(trackId);



  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId);

  let trackList = Track.getList();
  const playlist = Playlist.getById(playlistId);

  trackList = trackList.filter(track => {
    return playlist.tracks.every(playlistTrack => track.id !== playlistTrack.id)
  })


  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      name: 'Добавить в плейлист',
      playlistId,
      trackList
    }
  })
})
  // ================================================================

router.get('/spotify-track-add', function (req, res) {
  const id = Number(req.query.trackId);
  const playlistId = Number(req.query.playlistId);
  console.log(id);
  console.log(playlistId);

  Playlist.trackAdd(playlistId, id)

  const playlist = Playlist.getById(playlistId);


  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
      playlistId
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
