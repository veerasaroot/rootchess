import React from 'react';
import styled from 'styled-components';

const SummaryBlock = styled.div`
    padding: 30px;
    box-sizing: border-box;
    width: 100%;
    height: 400px;
    background-color: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const Summary = () => {
    return (
        <SummaryBlock>

        </SummaryBlock>
    )
};

export default React.memo(Summary);