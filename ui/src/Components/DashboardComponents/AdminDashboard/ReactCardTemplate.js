import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from './ReactCardTemplate.module.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const PerformanceIndicator = (props) => {

	if (props.growth_indicator !== '') {
		if (Number(props.growth_indicator.replace("%", "")) > 0) {
			return (
				<div className={styles.positivestyles}><ArrowForwardIcon className={styles.positivevector} /><var className={styles.positiveindicatorstyle}>{props.growth_indicator}</var></div>
			)
		}
		else {
			return (
				<div className={styles.negativestyles}><ArrowForwardIcon className={styles.negativevector} /><var className={styles.negativeindicatorstyle}>{props.growth_indicator}</var></div>
			)
		}
	}
	else {
		return (
			<div></div>
		)
	}
}


export const OutlinedCard = (props) => {
	return (
		// <Box >
		<Card className={styles.card} sx={{ minWidth: '20%', marginBottom: '2%', width: '30em', boxShadow: 'none' }}>
			<React.Fragment >
				<div className='card-body'>
					<CardContent>
						{/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Word of the Day
                </Typography> */}
						<Typography variant='h5' component='div' sx={{ fontWeight: 600, display: "flex" }}>
							{props.Title}&nbsp;&nbsp; <PerformanceIndicator growth_indicator={props.growth_indicator} />
						</Typography>
						<br></br>
						<Typography sx={{ mb: 1.5 }} color='text.secondary'>
							{props.subtitle}
						</Typography>
						<Typography variant='body2'>{props.text}</Typography>
					</CardContent>

				</div>
			</React.Fragment>
		</Card>
	);
};

export const ReactCard = (props) => (
	<div style={{ display: 'flex' }}>
		{/* {console.log('Type Of : ', props)} */}
		{props.SampleData.map((eachCard, i) => (
			<OutlinedCard
				Title={eachCard.title}
				growth_indicator={eachCard.growth_indicator}
				subtitle={eachCard.sub_title}
				text={eachCard.content}
				id={eachCard.id}
				key={i}
			/>
		))}
	</div>
);
