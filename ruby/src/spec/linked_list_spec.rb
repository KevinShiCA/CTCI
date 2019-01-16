# frozen_string_literal: true

require 'linked_list'

describe 'Linked List' do
  before :each do
    @ll = DataStructures::LinkedList.new
  end

  it 'should append elements correctly' do
    @ll.append(1)
    @ll.append(2)
    @ll.append(3)
    expect(@ll.to_array).to eq [1, 2, 3]

    @ll.clear
    expect(@ll.empty?).to be true
  end

  it 'should add, remove, and get elements by index correctly' do
    @ll.add(10, 0)
    @ll.add(20, 0)
    expect(@ll.get(1)).to eq 10
    @ll.add(30, 1)
    expect(@ll.to_array).to eq [20, 30, 10]

    @ll.remove_at(1)
    expect(@ll.to_array).to eq [20, 10]
    expect(@ll.get(1)).to eq 10

    @ll.add(40, 2)
    expect(@ll.to_array).to eq [20, 10, 40]

    @ll.add(50, 1)
    @ll.add(60, 1)
    @ll.add(70, 2)
    expect(@ll.to_array).to eq [20, 60, 70, 50, 10, 40]

    expect { @ll.add(11, 123) }.to raise_error('Index out of bounds: 123')
    expect { @ll.add(11, -10) }.to raise_error('Index out of bounds: -10')

    expect { @ll.get(123) }.to raise_error('Index out of bounds: 123')
    expect { @ll.get(-10) }.to raise_error('Index out of bounds: -10')

    expect { @ll.remove_at(123) }.to raise_error('Index out of bounds: 123')
    expect { @ll.remove_at(-10) }.to raise_error('Index out of bounds: -10')

    expect(@ll.contains(20)).to be true
    expect(@ll.contains(30)).to be false

    expect(@ll.index_of(60)).to eq 1

    # Add a duplicate value, index_of should find the first occurence.
    @ll.append(50)
    expect(@ll.index_of(50)).to eq 3
    expect(@ll.index_of(100)).to eq(-1)

    @ll.remove_at(1)
    expect(@ll.to_array).to eq [20, 70, 50, 10, 40, 50]

    @ll.remove_at(4);
    expect(@ll.to_array).to eq [20, 70, 50, 10, 50]

    @ll.remove_at(0)
    expect(@ll.get(0)).to eq 70
    @ll.remove_at(@ll.size - 1)
    expect(@ll.get(@ll.size - 1)).to eq 10

    @ll.clear
    @ll.append_all([1, 2, 3, 4])
    expect(@ll.remove_at(3)).to eq 4

    @ll.clear
    @ll.append(1)
    expect(@ll.remove_at(1)).to eq 1
  end

  it 'should map to array and linked list correctly' do
    @ll.append_all([1, 2, 3])
    expect(@ll.map_to_array(->(value, _) { value**2 })).to eq [1, 4, 9]
    expect(@ll.map_to_linked_list(->(value, _) { value**2 }).to_array).to eq [1, 4, 9]
  end

  it 'should filter to array and linked list correctly' do
    @ll.append_all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(@ll.filter_to_array(->(value, _) { value.even? })).to eq [2, 4, 6, 8, 10]
    expect(@ll.filter_to_linked_list(->(value, _) { value.odd? }).to_array).to eq [1, 3, 5, 7, 9]
  end

  it 'should find a value by predicate correctly' do
    @ll.append_all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(@ll.find(->(value, _) { value.even? })).to eq 2
    expect(@ll.find(->(value, _) { value > 10 })).to be nil
  end

  it 'should append arrays and linked lists correctly' do
    @ll.append_all([1, 2, 3])
    expect(@ll.size).to eq 3

    ll2 = DataStructures::LinkedList.new
    ll2.append_all(@ll)
    expect(ll2.size).to eq 3
    expect(@ll.to_array).to eq ll2.to_array
  end

  it 'should remove by value correctly' do
    @ll.append_all([1, 2, 3])
    @ll.remove(2)

    expect(@ll.to_array).to eq [1, 3]
    expect { @ll.remove(4) }.to raise_error('Value not found: 4')
    @ll.clear

    @ll.append_all([1, 2, 3, 4, 5])
    @ll.remove(1)
    expect(@ll.to_array).to eq [2, 3, 4, 5]
    @ll.remove(5)
    expect(@ll.to_array).to eq [2, 3, 4]
    @ll.clear

    @ll.append_all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(@ll.remove_all(->(value, _) { value.even? })).to eq [2, 4, 6, 8, 10]
    expect(@ll.to_array).to eq [1, 3, 5, 7, 9]
    expect(@ll.remove_all(->(value, _) { value < 4 })).to eq [1, 3]
    expect(@ll.to_array).to eq [5, 7, 9]
    expect(@ll.remove_all(->(value, _) { value == 5 })).to eq [5]
    expect(@ll.to_array).to eq [7, 9]
    expect(@ll.remove_all(->(value, _) { [7, 9].include?(value) })).to eq [7, 9]
    expect(@ll.empty?).to be true
  end

  it 'should convert to string correctly' do
    expect(@ll.to_s).to eq 'EMPTY LIST'
    @ll.append(1)
    expect(@ll.to_s).to eq '1'
    @ll.append(2)
    expect(@ll.to_s).to eq '1 -> 2'
    @ll.append_all([3, 4, 5])
    expect(@ll.to_s).to eq '1 -> 2 -> 3 -> 4 -> 5'
  end
end
