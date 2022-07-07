import React from 'react';
import ReactDOM from 'react-dom/client';

import panzoom from 'panzoom';

import { OrgChart } from '../lib/index.jsx';

import './style.css';


const data = {
  id: 1,
  children: [
    {
      id: 6,
      staff: true,
      strokeStyle: 'dotted',
      children: [
        {
          id: 9,
        },
        {
          id: 10,
        },
      ],
    },
    {
      id: 5,
      staff: true,
      children: [
        {
          id: 8,
        },
      ],
    },
    {
      id: 7,
      staff: true,
    },
    {
      id: 2,
      staff: false,
    },
    {
      id: 3,
      staff: false,
    },
    {
      id: 4,
      staff: false,
    },
  ],
};

const App = () => {
  const containerRef = React.useRef();

  React.useEffect(() => {
    /** @type {HTMLDivElement} */
    const container = containerRef.current;

    const instance = panzoom(container, {
      bounds: true,
      boundsPadding: 0.5,
      minZoom: 0.5,
      maxZoom: 1.5,
    });

		const zoom = (scale) => {
			const rect = container.getBoundingClientRect();

			const cx = rect.x + (rect.width / 2);
			const cy = rect.y + (rect.height / 2);

			instance.smoothZoom(cx, cy, scale);
		}

    /**
     * @param {KeyboardEvent} event
     */
    const handleKeyUp = (event) => {
      switch (event.key) {
        case '=': {
          event.preventDefault();
          zoom(1.25);
          break;
        }
        case '-': {
          event.preventDefault();
          zoom(0.75);
          break;
        }
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      instance.dispose();
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, []);

  return (
    <div className='chart-container'>
      <div className='chart-ref' ref={containerRef}>
        <OrgChart
          data={data}
					chartId='chart'
          render={(node) => {
            return <div className="card">id: {node.id}</div>;
          }}
        />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
