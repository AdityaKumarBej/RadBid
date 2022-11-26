import React, {Component} from 'react';
import Layout from '../src/Components/Layout/Layout';
import ContentContainer from '../src/Components/ContentContainer/ContentContainer';

export default class Index extends Component {

    constructor(props) {
        super(props);

        this.state = {
            headersActionsAvailable: true,
        }

    }

    render() {
        return (
            <Layout>
                <ContentContainer heading="Page Name" maxWidth="1350px" >
                    Some content goes here
                </ContentContainer>
            </Layout>
        )
    }

}