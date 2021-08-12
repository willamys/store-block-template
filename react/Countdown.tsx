import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { TimeSplit } from './typings/global';
import { tick, getTwoDaysFromNow } from './utils/time';
import { useCssHandles } from 'vtex.css-handles';
import { useProduct } from 'vtex.product-context';
import productReleaseDate from './graphql/productReleaseDate.graphql';

const CSS_HANDLES = ['container', 'countdown'];
const DEFAULT_TARGET_DATE = getTwoDaysFromNow();

interface CountdownProps {
}

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ }) => {

  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const handles = useCssHandles(CSS_HANDLES);
  const { product } = useProduct();
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: product?.linkText
    },
    ssr: false
  });

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime);

  if (!product) {
    return (
      <div>
        <span>There is no product context.</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  }
  //<h1>{targetDate}</h1>
  /**
   * *tachyons
   * <div className={`${handles.countdown} c-muted-1 db tc`}>
   * c-muted-1 =>cor do texto
   * db=> display-block 
   * tc=>text center
   */
  return (
    <div className={`${handles.container} t-heading-2 fw3 w-100 c-muted-1`}>
      <div className={`${handles.countdown} db tc`}>
        {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
      </div>
    </div>
  );
}

Countdown.schema = { //informações que serão lidas no editor do site
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    title: {
      title: 'Sou um título',
      type: 'string',
      default: null,
    },
    targetDate: {
      title: 'Data final',
      description: 'Data final utilizada no contador',
      type: 'string',
      default: null,
    },
  },
}

export default Countdown
