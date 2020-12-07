import "core-js/features/map";
import "core-js/features/set";
import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import './styles/index.scss';
import '@vkontakte/vkui/dist/vkui.css';
import store from "./state";
import App from "./core/App";
import bridge from "@vkontakte/vk-bridge";
import {fetchServerSupports, fetchServerUser} from "./state/reducers/vk/actions";
import {Spinner} from "@vkontakte/vkui";
// import usePromise from "react-promise-suspense";
// import('scroll-restoration-polyfill');

// Sentry.init({
//     dsn: "https://f8c9977da1fc4eaaa5660cb17643b50b@o481121.ingest.sentry.io/5529172",
//     integrations: [
//         new Integrations.BrowserTracing(),
//     ],
//
//     // We recommend adjusting this value in production, or using tracesSampler
//     // for finer control
//     tracesSampleRate: 1.0,
// });

// import("./eruda").then(({ default: eruda }) => {}); //runtime download

// if (process.env.NODE_ENV === "development") {
//     import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }

// class ErrorBoundary extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { hasError: false };
//     }
//
//     static getDerivedStateFromError(error) {
//         console.log(error)
//         // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
//         return { hasError: true };
//     }
//
//     // componentDidCatch(error, errorInfo) {
//     //     // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
//     // }
//
//     render() {
//         if (this.state.hasError) {
//             // Можно отрендерить запасной UI произвольного вида
//             return <h1>Что-то пошло не так.</h1>;
//         }
//
//         return this.props.children;
//     }
// }

// function useResource() {
//     return {
//         user_info:wrapPromise(bridge.send('VKWebAppGetUserInfo').then(user=>user), fetchServerUser().then(({data})=>data)),
//     }
// }
// function wrapPromise(promise_bridge, promise_server) {
//     let status = 'pending'
//     let result;
//
//     // const user = usePromise(promise_bridge)
//     // const user_server = usePromise(promise_server)
//     let suspender = Promise.all([promise_bridge, promise_server])
//         .then(data=>{
//             let user = data[0]
//             let user_server = data[1]
//
//             console.log(user)
//             console.log(user_server)
//
//             if (!user_server.city) {
//                 if (user.city.title==="") {
//                     user_server.city='Test'
//                     user_server.isCitySupport=false
//                     result={user,user_server}
//                     status = 'success'
//                 } else {
//                     fetchServerSupports(user.city.title)
//                         .then(({data})=>{
//                             user_server.city=user.city.title
//                             user_server.isCitySupport=data.city
//                             result={user,user_server}
//                             status = 'success'
//                         },err=>{
//                             result={user_server:{city:'Test',isCitySupport:false},user:user}
//                             status = 'error'
//                         })
//                 }
//             } else {
//                 result={user,user_server}
//                 result.user_server.isCitySupport=true
//                 status = 'success'
//             }
//         }, err=>{
//             result={user_server:{city:'Test',isCitySupport:false},user:{}}
//             status = 'error'
//         })
//     return {
//         read() {
//             if (status==='pending') {
//                 throw suspender
//             } else if (status === 'error') {
//                 throw result
//             } else {
//                 return result
//             }
//         }
//     }
// }

const AppSuspense = () => {
    const [userInfo,setUserInfo] = useState(null)

    useEffect(()=>{
        let result;
        Promise.all([bridge.send('VKWebAppGetUserInfo').then(user=>user), fetchServerUser().then(({data})=>data)])
            .then(data=>{
                let user = data[0]
                let user_server = data[1]

                console.log(user)
                console.log(user_server)

                if (!user_server.city) {
                    if (user.city.title==="") {
                        user_server.city='Test'
                        user_server.isCitySupport=false
                        result={user,user_server}
                        setUserInfo(result)
                    } else {
                        fetchServerSupports(user.city.title)
                            .then(({data})=>{
                                user_server.city=user.city.title
                                user_server.isCitySupport=data.city
                                result={user,user_server}
                                setUserInfo(result)
                            },err=>{
                                result={user_server:{city:'Test',isCitySupport:false},user:user}
                                setUserInfo(result)
                            })
                    }
                } else {
                    result={user,user_server}
                    result.user_server.isCitySupport=true
                    setUserInfo(result)
                }
            }, err=>{
                result={user_server:{city:'Test',isCitySupport:false},user:{}}
                setUserInfo(result)
            })
    },[])

    return (
        userInfo ? <App user_info={userInfo} /> : <Spinner />
    )
}

ReactDOM.render(
    <Provider store={store}>
        <AppSuspense />
    </Provider>,
    document.getElementById("root")
);
