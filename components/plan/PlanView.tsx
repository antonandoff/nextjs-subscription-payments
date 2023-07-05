import CheckoutButton from "./CheckoutButton";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  data?: any;
  addPlanToServer?: any;
  removePlanFromServer?: any;
  features: any;
  plan: any;
  server?:any
}

export default function PlanView(props: Props) {
  const data = props.data;
  const features = props.features;
  const plan = props.plan;
  
  const checkoutData = {
    id: plan.id,
    plan: plan,
    features: features
  }

  return (
    <div className="dark:text-white">
      <div
        key={data?.id}
        className={classNames(
          data?.mostPopular ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200',
          'rounded p-8'
        )}
      >
        <h3
          id={data?.id}
          className={classNames(
            data?.mostPopular
              ? 'text-indigo-600 '
              : 'text-gray-900',
            'text-lg font-semibold leading-8 dark:text-white'
          )}
        >
          {plan?.name}
        </h3>
        <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-white">
          ${(plan?.prices[0]?.unit_amount) / 100} / {plan?.prices[0]?.interval}
        </p>
        <p className="mt-6 flex items-baseline gap-x-1">
          <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {/* {data?.price['monthly']} */}
          </span>
        </p>
          <CheckoutButton data={checkoutData} plan={props.plan} features={features} server={props.server} />
        <ul
          role="list"
          className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-white"
        >
          {features.map((data: any, index: number) => {
            var liClass, svgClass, textClass;
            if (data.value == 0 || data.value == false) {
              liClass = 'flex space-x-3 line-through decoration-gray-500';
              svgClass =
                'flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500';
              textClass = 'text-base font-normal leading-tight text-gray-500';
            } else {
              liClass = 'flex space-x-3';
              svgClass =
                'flex-shrink-0 w-5 h-5 text-blue-600 dark:text-blue-500';
              textClass =
                'text-base font-normal leading-tight text-gray-500 dark:text-gray-400';
            }
            return (
              <li key={index} className={liClass}>
                <svg
                  aria-hidden="true"
                  className={svgClass}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Check icon</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className={textClass}>
                  {data.value} {data.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
