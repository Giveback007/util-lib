import React = require('react');
import { StateManager, clone, equal } from '.';
import { ComponentType, FunctionComponent, ComponentClass } from 'react';

export function stateLinker<S>(store: StateManager<S>) {
    class Linker<ChildProps, M, FP> extends React.Component<
        { mapper: (s: S) => M, Child: ComponentType<FP>, childProps: ChildProps }, M
    > {
        state = this.props.mapper(store.getState());

        subscription = store.subscribe((s) => {
            const newState = this.props.mapper(s);
            if (!equal(newState, this.state)) this.setState(newState);
        })

        componentWillUnmount = () => this.subscription.unsubscribe();

        shouldComponentUpdate = (nextProps: any, nextState: any) =>
            !equal(nextState, this.state)
            ||
            !equal(nextProps.childProps, this.props.childProps)

        render() {
            console.log('render', clone({ ...this.state, ...this.props }));

            // tslint:disable-next-line: variable-name
            const Child: ComponentType<ChildProps & M> = this.props.Child as any;
            return <Child {...{ ...this.state, ...this.props.childProps }} />;
        }
    }

    return function connect<
        FP, M, C extends ComponentClass<FP, any> | FunctionComponent<FP>
    // tslint:disable-next-line: variable-name
    >(mapper: (s: S) => M, Comp: C | ComponentType<FP>) {
        type Props = Pick<FP, Exclude<keyof FP, keyof M | 'children'>>;
        return ((props: Props) => {
            return <Linker<Props, M, FP> {...{ mapper, Child: Comp, childProps: props }} />
        }) as FunctionComponent<{ [K in keyof Props]: Props[K] }>;
    }
}
