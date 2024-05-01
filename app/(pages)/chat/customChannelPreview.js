import { useTranslationContext } from 'stream-chat-react';
import React, { useMemo } from 'react';


const CustomChannelPreview = (props) => {
    const {
      channel,
      activeChannel,
      displayImage,
      displayTitle,
      latestMessage,
      setActiveChannel,
    } = props;
    const latestMessageAt = channel.state.last_message_at;
    const isSelected = channel.id === activeChannel?.id;
    const { userLanguage } = useTranslationContext();
  
    const timestamp = useMemo(() => {
      if (!latestMessageAt) {
        return '';
      }
      const formatter = new Intl.DateTimeFormat(userLanguage, {
        timeStyle: 'short',
      });
      return formatter.format(latestMessageAt);
    }, [latestMessageAt, userLanguage]);
  
    const handleClick = () => {
      setActiveChannel?.(channel);
    };
  
    return (
      <button
        className={`channel-preview ${isSelected ? 'channel-preview_selected' : ''}`}
        disabled={isSelected}
        onClick={handleClick}
      >
        <img className='channel-preview__avatar' src={displayImage} alt='' />
        <div className='channel-preview__main'>
          <div className='channel-preview__header'>
            {displayTitle}
            <time dateTime={latestMessageAt?.toISOString()} className='channel-preview__timestamp'>
              {timestamp}
            </time>
          </div>
          <div className='channel-preview__message'>{latestMessage}</div>
        </div>
      </button>
    );
  };

export default CustomChannelPreview;
