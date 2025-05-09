import { animate, state, style, transition, trigger } from "@angular/animations";

export const ExpandAnimation = trigger('detailExpand', [
  state('collapsed, void', style({ height: '0px', minHeight: '0' })),
  state('expanded', style({ height: '*' })),
  transition(
    'expanded <=> collapsed',
    animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  ),
  transition(
    'void => expanded',
    animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ height: '*' }))
  ),
  transition(
    'void => collapsed',
    animate(
      '225ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      style({ height: '0px', minHeight: '0' })
    )
  ),
]);
