import { useState } from 'react';
import AudioCard from './AudioCard';
const CardList = ({ listName, cardList,type }) => {
    const [seeAll,setSeeAll]=useState(false);
    return (
        <div className="card-list p-8 last:pb-16">
            <div className="mb-3 flex justify-between"><div className="title text-gray-50 font-bold text-3xl">{listName}</div><a className="title text-gray-50 underline cursor-pointer" onClick={() => setSeeAll(!seeAll)}>{seeAll?'See Less':'See All'}</a></div>
            <div className={"list flex overflow-hidden "+(seeAll?"flex-wrap justify-center":"")}>
            {
                cardList.map((cardItem) => {
                    return <AudioCard type={type} songId={cardItem._id} imageurl={cardItem.imageUrl} songName={cardItem.name} songArtist={cardItem['artist']} ></AudioCard>
                })
            }
            </div>
        </div>
    );
}

export default CardList;