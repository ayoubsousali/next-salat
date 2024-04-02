import { useEffect, useState } from "react";
import Spinner from "./spinner";

const PullToRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 0) {
        setIsRefreshing(true);
        window.location.reload();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isRefreshing ? <Spinner /> : null;
};

export default PullToRefresh;
