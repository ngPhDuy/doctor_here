const TransactionIcon = ({ size = 24, color = "#828282" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.88458 10.9395V15.2424C2.88458 19.5453 4.60958 21.2703 8.9125 21.2703H14.0779C18.3808 21.2703 20.1058 19.5453 20.1058 15.2424V10.9395"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 11.6868C13.2538 11.6868 14.5475 10.2589 14.375 8.50518L13.7425 2.10352H9.26709L8.62501 8.50518C8.45251 10.2589 9.74626 11.6868 11.5 11.6868Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5471 11.6868C19.4829 11.6868 20.9012 10.1152 20.7096 8.18893L20.4412 5.55352C20.0962 3.06185 19.1379 2.10352 16.6271 2.10352H13.7042L14.375 8.82143C14.5379 10.4027 15.9658 11.6868 17.5471 11.6868Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.405 11.6868C6.98625 11.6868 8.41417 10.4027 8.5675 8.82143L8.77834 6.70352L9.23834 2.10352H6.31542C3.80459 2.10352 2.84625 3.06185 2.50125 5.55352L2.2425 8.18893C2.05084 10.1152 3.46917 11.6868 5.405 11.6868Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 16.4785C9.89959 16.4785 9.10417 17.2739 9.10417 18.8743V21.2702H13.8958V18.8743C13.8958 17.2739 13.1004 16.4785 11.5 16.4785Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TransactionIcon;
