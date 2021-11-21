const songCard = ({ imageLink, songName, songDesc }) => {
    return (
        <div className="w-52 h-64 m-12 rounded-md bg-white dark:bg-gray-800">
            <img src={imageLink} className="rounded-md object-cover w-52 h-52" alt="" srcset="" />
            <div class="text-xl font-medium text-white">{songName}</div>
            <p class="text-gray-500">{songDesc}</p>
        </div>
    );
}

export default songCard;