import { Page, Navbar, Block } from "framework7-react";

const Trv = props => {

    console.log("TRV", props.id);

    return (
        <Page>
            <Navbar title="Cronómetro" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <Block>
                <p>Cálculo de Tree-Row-Volume</p>
            </Block>
        </Page>
    )
};

export default Trv;