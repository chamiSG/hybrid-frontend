import "./card.scss";
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  text: {
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: 300
  },
});

function CardInfo(props: any) {

  const { label1, label2, value1, value2, active } = props;

  const classes = useStyles();

  return (
    <Box display={`${!active ? 'flex' : 'none'}`} justifyContent={"center"} flexDirection={"column"} p={"1rem"} borderRadius={"4px"} bgcolor={"#3a3a3a80"}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography className={classes.text}>{label1}</Typography>
        <Typography className={classes.text}>{value1}</Typography>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography className={classes.text}>{label2}</Typography>
        <Typography className={classes.text}>{value2}</Typography>
      </Box>
    </Box>
  );
}

export default CardInfo;
