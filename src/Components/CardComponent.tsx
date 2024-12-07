import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import { postInterface } from "../Interfaces/Posts";
import { Box } from "@mui/material";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

interface CardComponentProps {
  post: postInterface;
  showAllComments?: boolean;
}

export default function CardComponent({
  post,
  showAllComments,
}: CardComponentProps) {
  const navigate = useNavigate();
  return (
    <Card sx={{ marginY: "25px" }}>
      <CardHeader
        onClick={() => navigate(`/PostDetails/${post._id}`)}
        className="hover:bg-slate-100 duration-300 ease-in-out cursor-pointer"
        avatar={
          <Avatar
            src={post.user.photo}
            alt={post.user.name}
            sx={{ cursor: "pointer" }}
            aria-label="recipe"
          />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={post.user.name}
        subheader={post.createdAt}
        titleTypographyProps={{ style: { cursor: "pointer" } }}
      />

      <CardContent>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", wordBreak: "break-word" }}
        >
          {post.body}
        </Typography>
      </CardContent>
      {post.image && (
        <CardMedia
          component="img"
          height="194"
          image={post.image}
          alt="Paella dish"
        />
      )}
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "space-between",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex flex-1 items-center justify-center">
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
            <p className="text-base ms-2">Like</p>
          </IconButton>
        </div>
        <div className="border-x border-gray-400 flex flex-1 items-center justify-center">
          <IconButton aria-label="Comment on post">
            <InsertCommentIcon />
            <p className="text-base ms-2">Comment</p>
          </IconButton>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <IconButton aria-label="share">
            <ShareIcon />
            <p className="text-base ms-2">Share</p>
          </IconButton>
        </div>
      </CardActions>
      {!showAllComments && post.comments[0] && (
        <Box
          sx={{
            border: "0.5px solid #D7D3BF",
            borderRadius: "5px",
            bgcolor: "#F1F1F1",
            paddingBottom: 2,
            marginTop: "10px",
          }}
        >
          <CardHeader
            sx={{ paddingBottom: "5px" }}
            avatar={
              <Avatar
                src={post.comments[0].commentCreator.photo}
                alt={post.comments[0].commentCreator.name}
                sx={{ cursor: "pointer", bgcolor: red[500] }}
                aria-label="recipe"
              />
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={post.comments[0].commentCreator.name}
            subheader={post.comments[0].createdAt}
            titleTypographyProps={{ style: { cursor: "pointer" } }}
          />
          <Typography
            sx={{ paddingLeft: 9, fontWeight: 600, margin: 0 }}
            component={"p"}
          >
            {post.comments[0].content}
          </Typography>
        </Box>
      )}
      {showAllComments &&
        post.comments.map((comment) => {
          return (
            <Box
              key={comment._id}
              sx={{
                border: "0.5px solid #D7D3BF",
                borderRadius: "5px",
                bgcolor: "#F1F1F1",
                paddingBottom: 2,
                marginY: "10px",
              }}
            >
              <CardHeader
                sx={{ paddingBottom: "5px" }}
                avatar={
                  <Avatar
                    src={comment.commentCreator.photo}
                    alt={comment.commentCreator.name}
                    sx={{ cursor: "pointer", bgcolor: red[500] }}
                    aria-label="recipe"
                  />
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={comment.commentCreator.name}
                subheader={comment.createdAt}
                titleTypographyProps={{ style: { cursor: "pointer" } }}
              />
              <Typography
                sx={{ paddingLeft: 9, fontWeight: 600, margin: 0 }}
                component={"p"}
              >
                {comment.content}
              </Typography>
            </Box>
          );
        })}
    </Card>
  );
}
