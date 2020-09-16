const { React } = require('powercord/webpack');

module.exports = React.memo(
  (props) => (
    <svg viewBox='2 -2 28 28' width={28} height={28} {...props}>
      <path
        fill='currentColor'
        d='M 18 0 L 13 0 L 13 11 L 10 8 L 7 11 L 7 0 L 2 0 L 2 20 L 4.464844 24 L 21 24 L 21 5.722656 Z M 19 22 L 5.535156 22 L 4.320313 20 L 18 20 L 18 4.136719 L 19 6.277344 Z'
      />
    </svg>
  )
);