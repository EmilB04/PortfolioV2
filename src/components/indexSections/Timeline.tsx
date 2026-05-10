import { useTranslation } from 'react-i18next'
import MuiTimeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
import IndexLayout from './_layout';

export default function Timeline() {
  const { t } = useTranslation()
  const items = t('timeline.items', { returnObjects: true }) as Array<{
    time: string
    title: string
    description: string
  }>

  return (
    <IndexLayout id="timeline">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">{t('timeline.title')}</h2>
      </div>
      <MuiTimeline position="alternate">
        {items.map((item, index) => (
          <TimelineItem key={item.time + item.title}>
            <TimelineOppositeContent
              align="right"
              variant="body2"
              sx={{
                color: 'text.secondary',
                m: 'auto 0',
              }}
            >
              {item.time}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                {index === 0 ? <FastfoodIcon /> : index === 1 ? <LaptopMacIcon /> : index === 2 ? <HotelIcon /> : <RepeatIcon />}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                {item.title}
              </Typography>
              <Typography>{item.description}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </MuiTimeline>
    </IndexLayout>
  );
}
