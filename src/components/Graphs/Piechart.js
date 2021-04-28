import React from "react";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import {Pie} from "react-chartjs-2";
// reactstrap components
import {Card, CardBody, CardHeader, Row} from "reactstrap";
// core components
import {chartExample6, chartOptions, parseOptions} from "components/Graphs/Chart.js";

class Charts extends React.Component {
    componentWillMount() {
        if (window.Chart) {
            parseOptions(Chart, chartOptions());
        }
    }

    render() {
        return (
            <>
                <Card className="shadow">
                    <CardHeader className="border-0">
                        <Row className="align-items-center">
                            <div className="col">
                                <h3 className="mb-0">Container type chart</h3>
                                <hr/>
                            </div>
                        </Row>
                    </CardHeader>

                    <CardBody>
                        <div className="chart">
                            <Pie
                                data={chartExample6.data}
                                options={chartExample6.options}
                                className="chart-canvas"
                                id="chart-pie"
                            />
                        </div>
                    </CardBody>
                </Card>
            </>
        );
    }
}

 export default Charts;