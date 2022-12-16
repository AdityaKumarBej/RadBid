import React, { Component, useEffect } from 'react';
import styles from './TotalActionsRank.module.css'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const PerformanceIndicator = (props) => {
	if (props.growth_indicator !== '') {
		if (Number(props.growth_indicator.replace("%", "")) > 0) {
			return (
				<div className={styles.positivestyles} style={{ position: "relative", top: "35px", left: "-10px" }}>
					<ArrowForwardIcon className={styles.positivevector} /><var className={styles.positiveindicatorstyle}>{props.growth_indicator}</var></div>
			)
		}
		else {
			return (
				<div className={styles.negativestyles} style={{ position: "relative", top: "35px", left: "-10px" }}>
					<ArrowForwardIcon className={styles.negativevector} /><var className={styles.negativeindicatorstyle}>{props.growth_indicator}</var></div>
			)
		}
	}
	else {
		return (
			<div></div>
		)
	}
}

export default function TotalActions(props) {

	useEffect(() => {
		console.log("total actions props", props.latestactivity);
	}, [])


	return (
		<div className={styles.card} style={{ "margin-left": '1em', 'height': '335px' }}>
			{/* <img src={this.props.img} /> */}
			<div className='card-body' style={{ 'line-height': '8em' }}>
				<h2 style={{ display: "flex", "fontSize": "40px", "margin-top": "0px", "margin-bottom": "-20px", 'line-height': '102px' }}>
					<strong>
						{/* {props.latestactivity[0].title_1} */}
						{"23"}
					</strong>&nbsp;&nbsp;<PerformanceIndicator
						// growth_indicator={props.latestactivity[0].title_2}
						growth_indicator={"123"}
					/>
				</h2>
				<h5 style={{
					fontFamily: 'sans-serif',
					color: '#50555C',
					fontStyle: 'normal',
					fontWeight: '600',
					fontSize: '16px',
					lineHeight: '150%',
					marginBottom: '-3px',
					marginTop: '22px',

				}}>Total actions have been performed on your behalf by the Growth Station since last week.</h5>
				<p>67% of these actions had a positive impact.</p>
				{/* <h5>{this.props.author}</h5> */}
			</div>
		</div>
	);

}
