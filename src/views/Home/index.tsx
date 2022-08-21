import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Card, CardActions, Typography, Grid, CardMedia } from "@material-ui/core";
import "./home.scss";

function Home() {
    return (
        <div className="front-page">
            <Container maxWidth="md">
                <Card className="info-card">
                    <h2 className="text-light text-center">Hybrid V2</h2>
                    <div className="card-text" style={{ padding: "10px 40px" }}>
                        <p className="text-light info-card-text text-center">
                            The Hybrid V2 token is a step forward from the previous token. Instead of rebasing mechanism decreasing the price of the token, the price of the V2
                            token will always be backed. It works such that the price increases on buy and remains the same on sell, thus ensuring the price can only increase with
                            time.
                        </p>
                        <p className="text-light info-card-text text-center">
                            The V2 Token can only be bought/sold on this Dapp and not on any LP, this helps to ensure the price is completely backed by the protocol. V2 tokens can
                            be bought and sold through USDC/USD+.
                        </p>
                        <p className="text-light info-card-text text-center">
                            V2 tokens can also be locked to get veTokens. The ve tokens are non-transferable. They provide governance powers to the holders and all the investment
                            returns are distributed to the ve holders in the form of V2 tokens. This allows users to not only profit from the price increase of V2 but also earn
                            more V2 tokens.
                        </p>
                    </div>
                </Card>
            </Container>
        </div>
    );
}

export default Home;
