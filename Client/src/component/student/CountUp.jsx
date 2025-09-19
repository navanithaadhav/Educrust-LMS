import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}) {
  const ref = useRef(null);

  // Validate and default numeric values
  const targetTo = typeof to === "number" ? to : 0;
  const targetFrom = typeof from === "number" ? from : 0;

  const motionValue = useMotionValue(direction === "down" ? targetTo : targetFrom);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num) => {
    if (typeof num !== "number") return 0; // Safeguard
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      return parseInt(decimals) !== 0 ? decimals.length : 0;
    }
    return 0;
  };

  const maxDecimals = Math.max(
    getDecimalPlaces(targetFrom),
    getDecimalPlaces(targetTo)
  );

  // Initial number display
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(
        direction === "down" ? targetTo : targetFrom
      );
    }
  }, [targetFrom, targetTo, direction]);

  // Trigger animation when in view
  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") onStart();

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? targetFrom : targetTo);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(() => {
        if (typeof onEnd === "function") onEnd();
      }, delay * 1000 + duration * 1000);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    targetFrom,
    targetTo,
    delay,
    onStart,
    onEnd,
    duration,
  ]);

  // Update DOM element on spring change
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const hasDecimals = maxDecimals > 0;

        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: hasDecimals ? maxDecimals : 0,
          maximumFractionDigits: hasDecimals ? maxDecimals : 0,
        };

        const formattedNumber = Intl.NumberFormat("en-US", options).format(latest);

        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }
    });

    return () => unsubscribe();
  }, [springValue, separator, maxDecimals]);

  return <span className={className} ref={ref} />;
}
  <div className="flex gap-6 justify-center items-center bg-white py-8">
        <div className="flex flex-wrap justify-center items-center gap-6 py-8">
          {stats.map(({ from, to, label }, idx) => (
            <div
              key={label}
              className={[
                "w-60 h-40 flex flex-col justify-center items-center rounded-xl shadow-lg text-white font-bold",
                idx === 0
                  ? "bg-gradient-to-br from-green-300 to-blue-500"
                  : idx === 1
                    ? "bg-gradient-to-tr from-yellow-400 to-yellow-200"
                    : idx === 2
                      ? "bg-gradient-to-br from-pink-400 to-pink-200"
                      : "bg-gradient-to-br from-cyan-300 to-indigo-400",
              ].join(" ")}
            >
              <span className="text-4xl">
                <CountUp
                  from={from}
                  to={to}
                  duration={2}
                  separator=","
                  className="count-up-text"
                />
              </span>
              <span className="text-base font-normal mt-2 opacity-90">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>