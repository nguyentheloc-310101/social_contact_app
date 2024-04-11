import { create } from 'zustand';
interface IPlanCreate {
  place: string;
  duration: string;
}
interface State {
  plan: IPlanCreate | undefined;
}
type Action = {
  setPlan: (plan: State['plan']) => void;
};

const usePlanStore = create<State & Action>((set) => ({
  plan: { place: '', duration: '' },
  setPlan: (plan) => set(() => ({ plan: plan })),
}));

function usePlanCreate() {
  let plan = usePlanStore((state) => state.plan);
  let setPlan = usePlanStore((state) => state.setPlan);

  return { plan, setPlan };
}
export default usePlanCreate;
