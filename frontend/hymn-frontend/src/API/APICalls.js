import { API } from './API';

export const getSongs = () => {
    return fetch(`${API}song/all`, {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
}

export const getPlaylists = () => {
    return fetch(`${API}playlist/all`, {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
}

export const getAlbums = () => {
    return fetch(`${API}album/all`, {
        method: "GET",
    }).then((response) => {
        return response.json();
    }).catch((err) => console.log(err));
}

export const getAlbum=(id,play)=>{
    return fetch(`${API}album/${id}/${play}`, {
        method: "GET",
    }).then((response) => {
        return response.json();
    }).catch((err) => console.log(err));
}