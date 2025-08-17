import { useAppStore } from "../store/useCommonStore";
import { logEvtToLocalStorage } from "./log";

export default {
    mounted(el, binding) {
        const app1store = useAppStore();
        const eventName = binding.arg || 'click';
        const trackData = binding.value;

        el.addEventListener(eventName, (e) =>{
            if(app1store.logClickFlag) {
                logEvtToLocalStorage({
                    timestamp: new Date().toISOString(),
                    element: el.tagName.toLowerCase(),
                    id: el.id || null,
                    class: el.className || null,
                    text: el.textContent.trim().substring(0, 50),
                    ...(typeof trackData === 'object' ? trackData : { value: trackData })
                })
            }
        })
    }
}