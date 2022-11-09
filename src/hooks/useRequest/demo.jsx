import { Input, Button } from "antd";
import { useState, useRef } from "react";
import { useRequest } from "./index";
let success = true;
let count = 0;
function getName() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve("henry");
      // reject(new Error("失败了"));
      if (success) {
        resolve(++count + "henry");
      } else {
        reject(new Error("获取失败"));
      }
    }, 1000);
  });
}
let updateSuccess = true;
function updateName(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (updateSuccess) {
        resolve(username);
      } else {
        reject(new Error("修改用户名失败"));
      }
      updateSuccess = !updateSuccess;
    }, 3000);
  });
}
const initialUserId = "1";
function Index() {
  // const [userId, setUserId] = useState(initialUserId);
  // const { data, loading, run, runAsync, refresh, refreshAsync } = useRequest(
  //   getName,
  //   {
  //     manual: false, // 手动触发 为true
  //     defaultParams: [initialUserId],
  //     onError(error) {
  //       console.log("手动run触发捕获异常", error);
  //     },
  //     onBefore: (params) => {
  //       console.info(`开始请求: ${params[0]}`);
  //     },
  //     onSuccess: (result, params) => {
  //       console.info(`请求成功:获取${params[0]}对应的用户名成功:${result}"!`);
  //     },
  //     onFinally: (params, result, error) => {
  //       console.info("请求完成");
  //     }
  //   }
  // );
  // if (loading) {
  //   return <div>loading...</div>;
  // }
  // if (error) {
  //   return <div>加载失败</div>;
  // }

  const lastRef = useRef();
  const [value, setValue] = useState("");
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState("1");
  const {
    data: name,
    loading,
    mutate,
    run
  } = useRequest(getName, {
    name: "getName",
    refreshDeps: [userId],
    refreshDepsAction() {
      console.log("refreshDepsAction");
    },
    refreshOnWindowFocus: true,
    focusTimespan: 5000
    // manual: true,
    // ready
    // pollingInterval: 1000,
    // pollingWhenHidden: false
  });
  // const { run, loading, cancel } = useRequest(updateName, {
  //   manual: true,
  //   name: "updateName",
  //   // loadingDelay: 1000,
  //   onSuccess: (result, params) => {
  //     setValue("");
  //     console.log(`用户名成功变更为 "${params[0]}" !`);
  //   },
  //   onError: (error, params) => {
  //     console.error(error.message);
  //     mutate(lastRef.current);
  //   },
  //   onCancel: () => {
  //     mutate(lastRef.current);
  //   }
  // });
  return (
    <>
      {/* <Input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="输入用户ID"
      />
      <br></br>
      <Button onClick={refresh}>refresh</Button>
      <Button onClick={refreshAsync}>refreshAsync</Button>
      <Button disabled={loading} onClick={() => run(userId)}>
        {loading ? "loading" : "run"}
      </Button>
      <Button disabled={loading} onClick={() => runAsync("柳")}>
        {loading ? "loading" : "runAsync"}
      </Button>
      <div>用户名： {data}</div> */}
      {name && <div>用户名: {name}</div>}
      <Input
        onChange={(event) => setValue(event.target.value)}
        value={value}
        placeholder="请输入用户名"
      />
      <Button
        onClick={() => {
          lastRef.current = name;
          mutate(value);
          run(value);
        }}
        type="button"
      >
        {loading ? "更新中......." : "更新"}
      </Button>
      {/* <Button onClick={cancel}>取消</Button> */}
      <p>
        Ready: {JSON.stringify(ready)}
        <Button onClick={() => setReady(!ready)}>切换Ready</Button>
      </p>
      <Button onClick={run}>run</Button>
      <Input
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
      ></Input>
    </>
  );
}

export default Index;
