import UIKit
import Then

class LotStandingsView: UIView {
    typealias LotStandingTappedClosure = (Int) -> Void

    let saleViewModel: SaleViewModel
    let isCompact: Bool
    let lotStandingTappedClosure: LotStandingTappedClosure
    let isFinalHeaderElement: Bool

    init(saleViewModel: SaleViewModel, isCompact: Bool, lotStandingTappedClosure: @escaping LotStandingTappedClosure, isFinalHeaderElement: Bool) {
        self.saleViewModel = saleViewModel
        self.isCompact = isCompact
        self.lotStandingTappedClosure = lotStandingTappedClosure
        self.isFinalHeaderElement = isFinalHeaderElement

        super.init(frame: CGRect.zero)

        setup()
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }
}

private typealias PrivateFunctions = LotStandingsView
extension PrivateFunctions {
    func setup() {
        guard saleViewModel.hasLotStandings else { return }

        let titleView = LotStandingsTitleView(isCompact: isCompact)
        addSubview(titleView)
        titleView.alignTopEdge(withView: self, predicate: "0")
        titleView.alignLeading("0", trailing: "0", toView: self)

        let listView = LotStandingsLotListView(saleViewModel: saleViewModel, isCompact: isCompact, lotStandingTappedClosure: lotStandingTappedClosure)
        addSubview(listView)
        listView.constrainTopSpace(toView: titleView, predicate: "0")
        listView.alignLeading("0", trailing: "0", toView: self)
        listView.alignBottomEdge(withView: self, predicate: isCompact ? "-10" : "-30")
        
        if (self.isFinalHeaderElement) {
            let bottomBorder = UIView().then {
                $0.backgroundColor = UIColor.artsyGrayRegular()
                $0.constrainHeight("1")
            }
            addSubview(bottomBorder)
            bottomBorder.alignBottomEdge(withView: self, predicate: "0")
            bottomBorder.alignLeading("0", trailing: "0", toView: self)
        }
    }
}
