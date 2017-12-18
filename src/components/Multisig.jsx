import React, { Component }     from 'react';
import { Row, Col, Button, FormGroup, ControlLabel, FormControl }
                                from 'react-bootstrap';
import { QRCode }               from 'react-qr-svg';
import { address }              from 'zencashjs';
import axios                    from 'axios';


class Multisig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            min: 2,
            max: 3,
            priv: [],
            redeem: '',
            addr: ''
        };
    }

    updateInputValue(e) {
        const _value    = parseInt(e.target.value, 10);
        const _id       = e.target.id;
        const _state    = this.state;

        if(!Number.isInteger(_value)) {
            console.log(_value);
            return;
        }

        _state[_id] = _value;
        this.setState(_state);
    }

    genAddress() {
        const _state    = {
            min: this.state.min,
            max: this.state.max,
            priv: [],
            redeem: '',
            addr: ''
        };

        axios.get(
            'https://www.random.org/cgi-bin/randbyte?nbytes=16&format=h'
        ).then(res => {
            for(let i = 0 ; i < this.state.max ; i++) {
                _state.priv.push(address.mkPrivKey(res.data + i));
            }

            _state.redeem   = address.mkMultiSigRedeemScript(
                _state.priv.map((x) => address.privKeyToPubKey(x, true)),
                _state.min,
                _state.max
            );

            _state.addr = address.multiSigRSToAddress(_state.redeem)

            this.setState(_state);
        });
    }

    render() {
        return (
            <Col md={12} id="Multisig">
                <hr />
                <Row className="r1">
                    <Col md={3}>
                        <FormGroup controlId="min"
                            bsSize="sm"
                        >
                            <ControlLabel>Minimum signatures</ControlLabel>
                            <FormControl type="text"
                                placeholder="2"
                                value={this.state.inputValue}
                                onChange={e => this.updateInputValue(e)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup controlId="max"
                            bsSize="sm"
                        >
                            <ControlLabel>Total shares</ControlLabel>
                            <FormControl type="text"
                                placeholder="3"
                                value={this.state.inputValue}
                                onChange={e => this.updateInputValue(e)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <Button onClick={() => this.genAddress()}>
                            Generate
                        </Button>
                    </Col>
                    <Col md={3}>
                        <Button onClick={window.print}>
                            Print
                        </Button>
                    </Col>
                </Row>
                <hr />
                {this.state.addr ? (
                    <Row className="r2">
                        <Col md={6} className="max-width">
                            <h1 style={{color:'green'}}>Public</h1>
                            <h3>Zen Address</h3>
                            <div>
                                <QRCode
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                    level="L"
                                    style={{ width: 256 }}
                                    value={this.state.addr}
                                />
                            </div>
                            <div>
                                {this.state.addr}
                            </div>
                        </Col>
                        <Col md={6} className="max-width">
                            <h1 style={{color:'red'}}>Secret</h1>
                            <div>
                                <b>Redeem Script : </b> {this.state.redeem}
                            </div>
                            <div>
                                <h3>Private Keys</h3>
                                {this.state.priv.map((priv) => (
                                    <div>
                                        <QRCode
                                            bgColor="#FFFFFF"
                                            fgColor="#000000"
                                            level="L"
                                            style={{ width: 128 }}
                                            value={priv}
                                        />
                                        <p>{priv}</p>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Row className="r2 no-padding"></Row>
                )}
                <hr />
                <Row className="r3">
                    <Col>
                        <p>
                            <b>A Multi Signature wallet</b> is useful if the funds belong to more than one person. It's like a joint account.
                        </p>
                        <p>
                            You can choose how many people has a key, and how many keys are needed to manage the funds.
                        </p>
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default Multisig;