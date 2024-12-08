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
import { Box } from "@mui/material";
import { red } from "@mui/material/colors";
import { postInterface } from "../Interfaces/Posts";

export default function PostDetailsCard({ post }: { post: postInterface }) {
  if (!post) return <Typography>No Post Found</Typography>;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap:{xs: '0' , sm: '20px'},
        marginY: '20px',
      }}
    >
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post image"
          sx={{
            width: { xs: "100%", lg: "70%" },
            height: { xs: "auto", sm: "800px" },
            objectFit: {xs: "contain" , sm: 'cover'},
            borderRadius: '5px'
          }}
        />
      )}

      {/* User Info */}
      <Box sx={{width: { xs: "100%", lg: "30%" }, border:'1px solid #ECEBDE'}}>
        <CardHeader
          avatar={
            <Avatar
              src={post.user.photo}
              alt={post.user.name}
              sx={{ cursor: "pointer" }}
            />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={post.user.name}
          subheader={new Date(post.createdAt).toLocaleString()}
          titleTypographyProps={{ sx: { cursor: "pointer" } }}
        />

        {/* Post Body */}
        <CardContent>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", wordBreak: "break-word" }}
          >
            {post.body}
          </Typography>
        </CardContent>

        {/* Actions */}
        <CardActions
          disableSpacing
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderTop:'1px solid #ECEBDE',
            borderBottom:'1px solid #ECEBDE',
          }}
        >
          <IconButton aria-label="like">
            <FavoriteIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Like
            </Typography>
          </IconButton>

          <IconButton aria-label="comment">
            <InsertCommentIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Comment
            </Typography>
          </IconButton>

          <IconButton aria-label="share">
            <ShareIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Share
            </Typography>
          </IconButton>
        </CardActions>

        {/* Comments */}
        {post.comments?.map((comment) => (
          <Box
            key={comment._id}
            sx={{
              border: "0.5px solid #D7D3BF",
              borderRadius: "5px",
              bgcolor: "#F1F1F1",
              paddingBottom: 2,
              marginY: "10px",
              marginX:'7px'
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  src={comment.commentCreator.photo}
                  alt={comment.commentCreator.name}
                  sx={{ cursor: "pointer", bgcolor: red[500] }}
                />
              }
              title={comment.commentCreator.name}
              subheader={new Date(comment.createdAt).toLocaleString()}
              titleTypographyProps={{ sx: { cursor: "pointer" } }}
            />
            <Typography sx={{ pl: 9, fontWeight: 600 }}>
              {comment.content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
