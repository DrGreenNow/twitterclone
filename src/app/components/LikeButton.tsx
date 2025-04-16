import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type LikeButtonProps = {
  likesCount: number | null;
  isUserHasLiked: boolean;
  handleLike: ()=>void
};

const LikeButton = ({
  likesCount,
  isUserHasLiked,
  handleLike,
}: LikeButtonProps) => {

  return (
    <button
      onClick={handleLike}
      className="flex items-center space-x-1 p-3 rounded-full hover:bg-rose-950/60 hover:text-red-500 transition duration-200 cursor-pointer">
      {isUserHasLiked ? (
        <AiFillHeart className="w-4 h-3.75 text-red-600" />
      ) : (
        <AiOutlineHeart className="w-4 h-3.75" />
      )}

      <span>{likesCount ?? 0}</span>
    </button>
  );
};

export default LikeButton;
