x.s('observeDOM', () => {
    const processAddedNodes = async (target, addedNodes) => {
      for (let node of addedNodes) {
        if (!node.classList) continue
        if (node.classList.contains('skipSave')) {
          return true
        }
        if (node.classList.contains('stored')) {
          await x.p('saveBlock', { dom: node })
          return true
        }
      }

      const t = findStored(target)
      if (t) {
        await x.p('saveBlock', { dom: t })
        return true
      }
    }
    const processRemovedNodes = async (target, removedNodes) => {
      for (let node of removedNodes) {
        if (!node.classList) continue
        if (node.classList.contains('skipSave')) {
          return true
        }
      }

      const t = findStored(target)
      if (t) {
        await x.p('saveBlock', { dom: t })
        return true
      }
    }
    const findStored = (dom) => {
      let t = dom
      while (t) {
        if (t.classList && t.classList.contains('stored')) return t
        t = t.parentNode
      }
      return null
    }

    const ob = new MutationObserver(async (mutationList, observer) => {
      for (const mut of mutationList) {
        let t = mut.target

        //console.log(mut)
        if (mut.addedNodes.length > 0) {
          const result = await processAddedNodes(t, mut.addedNodes)
          if (result === true) return
        } else if (mut.removedNodes.length > 0) {
          const result = await processRemovedNodes(t, mut.removedNodes)
          if (result === true) return
        }

        t = findStored(mut.target)
        if (t) return await x.p('saveBlock', { dom: t })
      }
    })
    ob.observe(app, {
      attributes: true,
      attributeOldValue: true,
      childList: true,
      subtree: true,
      characterData: true,
    })
    
  })